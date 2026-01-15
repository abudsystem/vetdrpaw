import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { authMiddleware } from "@/middleware/auth.middleware";
import { UserPayload } from "@/types/auth";

export class AppError extends Error {
    statusCode: number;
    constructor(message: string, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
    }
}

interface HandlerOptions {
    requiredRoles?: string[];
    requireAuth?: boolean;
}

type HandlerFunction = (req: Request, context: { user?: UserPayload; params: any }) => Promise<NextResponse>;

export const apiHandler = (handler: HandlerFunction, options: HandlerOptions = {}) => {
    return async (req: Request, { params }: { params: any } = { params: {} }) => {
        try {
            // Await params if it's a promise (Next.js 15+)
            const resolvedParams = await params;

            let user: UserPayload | undefined;

            if (options.requireAuth || options.requiredRoles) {
                const decoded = await authMiddleware(req);
                if (!decoded) {
                    throw new AppError("No autorizado", 401);
                }
                user = decoded;

                if (options.requiredRoles && !options.requiredRoles.includes(user.role)) {
                    throw new AppError("Permisos insuficientes", 403);
                }
            }

            return await handler(req, { user, params: resolvedParams });
        } catch (err: any) {
            // VALIDACIÓN (400) - ZodError can come from schema.parse() in controllers
            if (err instanceof ZodError) {
                return NextResponse.json(
                    {
                        error: "VALIDATION_ERROR",
                        message: "Datos inválidos",
                        fields: err.issues.map((e: any) => ({
                            field: e.path.join("."),
                            message: e.message
                        }))
                    },
                    { status: 400 }
                );
            }

            // ERRORES CONTROLADOS DE NEGOCIO
            if (err instanceof AppError) {
                return NextResponse.json(
                    {
                        error: "Usuario ya Existente",
                        message: err.message
                    },
                    { status: err.statusCode }
                );
            }

            // ERROR DESCONOCIDO
            console.error("[UNHANDLED API ERROR]", err);

            return NextResponse.json(
                {
                    error: "INTERNAL_SERVER_ERROR",
                    message: "Ocurrió un error inesperado"
                },
                { status: 500 }
            );
        }
    };
};
