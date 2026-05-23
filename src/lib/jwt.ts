import jwt from "jsonwebtoken";
import { config } from "./config";

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn as jwt.SignOptions["expiresIn"],
  });
}

export function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, config.jwt.secret) as JWTPayload;
  } catch {
    throw new Error("Invalid or expired token");
  }
}

export function extractToken(authHeader: string | null): string {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No token provided");
  }
  return authHeader.split(" ")[1];
}