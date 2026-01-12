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
  }, { requiredRoles: ["administrador", "veterinario"] }),

  update: apiHandler(async (req: Request) => {
    const body = await req.json();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) throw new AppError("El ID es requerido", 400);

    const updatedUser = await UserService.update(id, body);
    if (!updatedUser) throw new AppError("Usuario no encontrado", 404);

    return NextResponse.json(updatedUser);
  }, { requiredRoles: ["administrador"] }),

  delete: apiHandler(async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) throw new AppError("El ID es requerido", 400);

    const deletedUser = await UserService.delete(id);
    if (!deletedUser) throw new AppError("Usuario no encontrado", 404);

    return NextResponse.json({ message: "Usuario eliminado correctamente" });
  }, { requiredRoles: ["administrador"] }),

  me: apiHandler(async (req, { user }) => {
    const userData = await UserService.getMe(user!.id);
    if (!userData) return NextResponse.json(null);

    return NextResponse.json(userData);
  }, { requireAuth: true }),

  updateMe: apiHandler(async (req, { user }) => {
    const body = await req.json();
    const data = updateProfileSchema.parse(body);

    const updatedUser = await UserService.update(user!.id, data);
    if (!updatedUser) throw new AppError("Usuario no encontrado", 404);

    return NextResponse.json(updatedUser);
  }, { requireAuth: true }),

  changeRole: apiHandler(async (req: Request) => {
    const body = await req.json();
    const { userId, newRole } = body;

    const updatedUser = await UserService.changeRole(userId, newRole);
    if (!updatedUser) throw new AppError("Usuario no encontrado", 404);

    return NextResponse.json({
      message: "Rol actualizado correctamente",
      user: updatedUser,
    });
  }, { requiredRoles: ["administrador"] }),
};
