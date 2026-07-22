import { z } from "zod";
import { profileService } from "@/services/profileService";
import { ApiError } from "@/utils/apiResponse";

const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().url().optional(),
  bio: z.string().max(500).optional(),
  github: z.string().min(1).max(100).optional(),
  githubPat: z.string().optional(),
  leetcode: z.string().min(1).max(100).optional(),
  hackerrank: z.string().min(1).max(100).optional(),
});

export const profileController = {
  getProfile(userId: string) {
    return profileService.getProfile(userId);
  },

  updateProfile(userId: string, body: unknown) {
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      throw ApiError.badRequest("Invalid profile payload", parsed.error.flatten());
    }
    return profileService.updateProfile(userId, parsed.data);
  },
};
