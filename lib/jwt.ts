import jwt from "jsonwebtoken";

export interface TokenPayload {
  id: string;
  role: string;
  iat?: number;
  exp?: number;
}

export function signToken(payload: TokenPayload) {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
}
