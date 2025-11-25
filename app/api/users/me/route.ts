import { UserController } from "@/controllers/user.controller";

export const GET = UserController.me;
export const PATCH = UserController.updateMe;
