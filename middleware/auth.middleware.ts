import { verifyToken } from "@/lib/jwt";
import { UserPayload } from "@/types/auth";

export async function authMiddleware(req: Request): Promise<UserPayload | null> {
  const header = req.headers.get("authorization");
  let token;

  if (header) {
    token = header.split(" ")[1];
  } else {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    token = cookieStore.get("token")?.value;
  }

  if (!token) return null;

  try {
    const decoded = verifyToken(token) as UserPayload;
    return decoded;
  } catch {
    return null;
  }
}
