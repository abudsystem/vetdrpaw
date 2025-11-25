import { AuthService } from "@/services/auth.service";
import { NextResponse } from "next/server";
import { apiHandler } from "@/lib/api-handler";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["cliente", "veterinario"]).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const AuthController = {
  register: apiHandler(async (req: Request) => {
    const body = await req.json();
    const data = registerSchema.parse(body);
    const user = await AuthService.register(data);
    return NextResponse.json(user, { status: 201 });
  }),

  login: apiHandler(async (req: Request) => {
    const body = await req.json();
    const data = loginSchema.parse(body);
    const result = await AuthService.login(data.email, data.password);
    return NextResponse.json(result, { status: 200 });
  }),
};
