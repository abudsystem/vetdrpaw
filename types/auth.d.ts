import { JwtPayload } from "jsonwebtoken";

export interface UserPayload extends JwtPayload {
  id: string;
  email: string;
  role: "cliente" | "veterinario" | "administrador";
}


const user = await authMiddleware(req) as UserToken | null;
if (!user || user.role !== "veterinario") {
  return NextResponse.json({ error: "No autorizado" }, { status: 401 });
}