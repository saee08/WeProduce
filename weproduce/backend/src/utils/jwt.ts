import jwt from "jsonwebtoken";
import type { AuthTokenPayload } from "@/types/domain";

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET is not set. Add it to your environment variables.");
    }
    return "default-weproduce-dev-jwt-secret-key-change-in-prod";
  }
  return secret;
}

export function signAuthToken(payload: AuthTokenPayload): string {
  const secret = getSecret();
  const expiresIn = process.env.JWT_EXPIRES_IN ?? "7d";
  return jwt.sign(payload, secret, { expiresIn: expiresIn as any });
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  const secret = getSecret();
  return jwt.verify(token, secret) as AuthTokenPayload;
}
