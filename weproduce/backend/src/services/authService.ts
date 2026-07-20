import { OAuth2Client } from "google-auth-library";
import { userRepository } from "@/repositories/userRepository";
import { signAuthToken } from "@/utils/jwt";
import { ApiError } from "@/utils/apiResponse";
import { logger } from "@/utils/logger";

const oauthClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export const authService = {
  getGoogleAuthUrl(): string {
    return oauthClient.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: ["openid", "email", "profile"],
    });
  },

  /**
   * Exchanges a Google OAuth authorization code for tokens, verifies the
   * ID token, and provisions (or fetches) the corresponding local user.
   * Returns a WeProduce session JWT the mobile app stores and sends as
   * a Bearer token on every subsequent request.
   */
  async loginWithGoogleCode(code: string) {
    const { tokens } = await oauthClient.getToken(code);
    if (!tokens.id_token) {
      throw ApiError.unauthorized("Google did not return an ID token");
    }

    const ticket = await oauthClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email) {
      throw ApiError.unauthorized("Invalid Google identity payload");
    }

    let user = await userRepository.findByGoogleId(payload.sub);

    if (!user) {
      // This platform is scoped to exactly three known developers.
      // Restrict signups to an allowlist configured at deploy time.
      const allowlist = (process.env.ALLOWED_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
      if (allowlist.length > 0 && !allowlist.includes(payload.email.toLowerCase())) {
        throw ApiError.forbidden("This account is not authorized for WeProduce.");
      }

      user = await userRepository.createFromGoogleProfile({
        googleId: payload.sub,
        email: payload.email,
        emailVerified: payload.email_verified ?? false,
        displayName: payload.name ?? payload.email.split("@")[0],
        avatarUrl: payload.picture ?? null,
      });
      logger.info({ userId: user.id }, "New user provisioned via Google OAuth");
    }

    const token = signAuthToken({ userId: user.id, email: user.email });
    return { token, userId: user.id, isNewUser: !user.profile?.onboardingComplete };
  },
};
