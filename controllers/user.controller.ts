import { UserService } from "@/services/user.service";
import { NextResponse } from "next/server";
import { apiHandler, AppError } from "@/lib/api-handler";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
});

export const UserController = {
  list: apiHandler(async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const search = searchParams.get("search");

    const users = await UserService.list({ role, search });
    return NextResponse.json(users);
  }),

  update: apiHandler(async (req: Request) => {
    const body = await req.json();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) throw new AppError("ID is required", 400);

    const updatedUser = await UserService.update(id, body);
    if (!updatedUser) throw new AppError("User not found", 404);

    return NextResponse.json(updatedUser);
  }),

  delete: apiHandler(async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) throw new AppError("ID is required", 400);

    const deletedUser = await UserService.delete(id);
    if (!deletedUser) throw new AppError("User not found", 404);

    return NextResponse.json({ message: "User deleted successfully" });
  }),

  me: apiHandler(async (req: Request) => {
    const { cookies } = await import("next/headers");
    const { verifyToken } = await import("@/lib/jwt");
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) throw new AppError("Unauthorized", 401);

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (e) {
      throw new AppError("Invalid token", 401);
    }

    const user = await UserService.getMe(decoded.id);
    if (!user) throw new AppError("Usuario no encontrado", 404);

    return NextResponse.json(user);
  }),

  updateMe: apiHandler(async (req: Request) => {
    const { cookies } = await import("next/headers");
    const { verifyToken } = await import("@/lib/jwt");
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) throw new AppError("Unauthorized", 401);
    const decoded = verifyToken(token);

    const body = await req.json();
    const data = updateProfileSchema.parse(body);

    const user = await UserService.update(decoded.id, data);
    if (!user) throw new AppError("Usuario no encontrado", 404);

    return NextResponse.json(user);
  }),

  changeRole: apiHandler(async (req: Request) => {
    const body = await req.json();
    const { userId, newRole } = body;

    const updatedUser = await UserService.changeRole(userId, newRole);
    if (!updatedUser) throw new AppError("User not found", 404);

    return NextResponse.json({
      message: "Rol actualizado correctamente",
      user: updatedUser,
    });
  }),
};
