import { z } from "zod";
import { authService } from "@/services/authService";
import { ApiError } from "@/utils/apiResponse";

const loginSchema = z.object({
  code: z.string().min(1, "Google authorization code is required"),
});

export const authController = {
  getAuthUrl() {
    return { url: authService.getGoogleAuthUrl() };
  },

  async login(body: unknown) {
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      throw ApiError.badRequest("Invalid login payload", parsed.error.flatten());
    }
    return authService.loginWithGoogleCode(parsed.data.code);
  },
};
