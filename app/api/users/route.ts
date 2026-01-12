import { UserController } from "@/controllers/user.controller";

export const GET = UserController.list;
export const PUT = UserController.update;
export const DELETE = UserController.delete;
