import connectDB from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();

    // Obtener datos del body
    const { name, email, password } = await req.json();

    // Validaciones básicas
    if (!name || !email || !password) {
      return Response.json(
        { message: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    // Validar si ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json(
        { message: "El correo ya está registrado" },
        { status: 400 }
      );
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario sin role → usa el default del modelo
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Convertir a objeto plano
    const userObj = newUser.toObject();

    // Eliminar la contraseña antes de devolver
    delete userObj.password;

    return Response.json(userObj, { status: 201 });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return Response.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
