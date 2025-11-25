import { AppError } from "./api-handler";
import { TokenPayload } from "./jwt";

export function requireRole(user: TokenPayload | null, roles: string[]) {
  if (!user) {
    throw new AppError("Not authenticated", 401);
  }

  if (!roles.includes(user.role)) {
    throw new AppError("Not authorized", 403);
  }

  return true;
}
