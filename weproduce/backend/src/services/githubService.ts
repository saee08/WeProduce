import { Octokit } from "octokit";
import { activityRepository } from "@/repositories/activityRepository";
import { pointsForGithubPush } from "@/config/scoring";
import { toUtcMidnight } from "@/utils/dateUtils";
import { logger } from "@/utils/logger";

export interface GithubCommitDTO {
  sha: string;
  repository: string;
  message: string;
  date: string; // ISO
  url: string;
}

export const githubService = {
  /**
   * Fetches the authenticated user's recent commit activity across all
   * repos they've pushed to (via the events API, which is the only
   * endpoint that doesn't require enumerating every repo individually).
   */
  async fetchRecentCommits(accessToken: string, githubUsername: string, sinceDays = 14): Promise<GithubCommitDTO[]> {
    const octokit = new Octokit({ auth: accessToken });
    const since = new Date();
    since.setDate(since.getDate() - sinceDays);

    const { data: events } = await octokit.rest.activity.listPublicEventsForUser({
      username: githubUsername,
      per_page: 100,
    });

    const commits: GithubCommitDTO[] = [];

    for (const event of events) {
      if (event.type !== "PushEvent") continue;
      if (new Date(event.created_at ?? 0) < since) continue;

      const payload = event.payload as {
        commits?: { sha: string; message: string; url: string }[];
      };

      for (const commit of payload.commits ?? []) {
        if (!commit || !commit.sha) continue;
        commits.push({
          sha: commit.sha,
          repository: event.repo.name,
          message: commit.message ?? "Git commit push",
          date: event.created_at ?? new Date().toISOString(),
          url: `https://github.com/${event.repo.name}/commit/${commit.sha}`,
        });
      }
    }

    return commits;
  },

  /**
   * Syncs GitHub commit activity into the activities table.
   * Each unique commit SHA becomes one `github_push` activity, worth a
   * fixed number of points, deduped via the externalId unique constraint.
   */
  async syncCommitsForUser(userId: string, accessToken: string, githubUsername: string) {
    const commits = await this.fetchRecentCommits(accessToken, githubUsername);

    let created = 0;
    for (const commit of commits) {
      if (!commit) continue;
      const msg = commit.message || "Git commit push";
      const result = await activityRepository.createIfNotExists({
        userId,
        platform: "github",
        activityType: "github_push",
        title: (msg.split("\n")[0] || msg).slice(0, 200),
        difficulty: "none",
        points: pointsForGithubPush(),
        activityDate: toUtcMidnight(new Date(commit.date)),
        externalId: commit.sha,
        metadata: { repository: commit.repository, url: commit.url },
      });
      created += 1;
      void result;
    }

    logger.info({ userId, githubUsername, commitsProcessed: commits.length }, "GitHub sync complete");
    return { commitsProcessed: commits.length, created };
  },
};
