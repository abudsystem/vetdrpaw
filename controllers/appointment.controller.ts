import { AppointmentService } from "@/services/appointment.service";
import { NextResponse } from "next/server";
import { apiHandler, AppError } from "@/lib/api-handler";
import { z } from "zod";

const createAppointmentSchema = z.object({
    pet: z.string(),
    veterinarian: z.string().optional(), // Ahora opcional para clientes
    date: z.string().transform((str) => new Date(str)),
    reason: z.string().min(1),
});

const updateAppointmentSchema = z.object({
    status: z.enum(["pendiente", "aceptada", "cancelada", "completada"]).optional(),
    notas: z.string().optional(),
});

export const AppointmentController = {
    create: apiHandler(async (req: Request) => {
        const body = await req.json();
        const data = createAppointmentSchema.parse(body);

        // Get user from token to set createdBy
        const { cookies } = await import("next/headers");
        const { verifyToken } = await import("@/lib/jwt");
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) throw new AppError("Unauthorized", 401);
        const decoded = verifyToken(token);

        // Add createdBy field
        const appointmentData = {
            ...data,
            createdBy: decoded.id,
        };

        // Cast to any to avoid ObjectId type mismatch, Mongoose handles string -> ObjectId
        const appointment = await AppointmentService.create(appointmentData as any);
        return NextResponse.json(appointment, { status: 201 });
    }),

    list: apiHandler(async () => {
        const appointments = await AppointmentService.list();
        return NextResponse.json(appointments);
    }),

    update: apiHandler(async (req: Request) => {
        const body = await req.json();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) throw new AppError("ID is required", 400);

        const data = updateAppointmentSchema.parse(body);
        const updated = await AppointmentService.update(id, data as any);

        if (!updated) throw new AppError("Appointment not found", 404);

        return NextResponse.json(updated);
    }),
};
