import type { NextRequest } from "next/server";
import { requireAuth } from "@/middleware/withAuth";
import { discussionService } from "@/services/discussionService";
import { ok, fail } from "@/utils/apiResponse";

export async function GET(request: NextRequest) {
  try {
    requireAuth(request);
    const posts = await discussionService.getPosts();
    return ok(posts);
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = requireAuth(request);
    const body = await request.json();
    const post = await discussionService.createPost(userId, body.title, body.content);
    return ok(post);
  } catch (error) {
    return fail(error);
  }
}
