import connectDB from "@/lib/db";
import { AuthController } from "@/controllers/auth.controller";

export async function POST(req: Request) {
  await connectDB();
  return AuthController.login(req);
}
