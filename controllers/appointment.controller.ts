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
    status: z.enum(["pendiente", "aceptada", "cancelada", "completado"]).optional(),
    notas: z.string().optional(),
});

export const AppointmentController = {
    create: apiHandler(async (req: Request, { user }) => {
        const body = await req.json();
        const data = createAppointmentSchema.parse(body);

        const appointment = await AppointmentService.create({
            ...data,
            createdBy: user!.id,
        } as any);
        return NextResponse.json(appointment, { status: 201 });
    }, { requireAuth: true }),

    list: apiHandler(async (req, { user }) => {
        const { searchParams } = new URL(req.url);
        const petId = searchParams.get("petId") || undefined;
        const myAppointments = searchParams.get("my_appointments") || undefined;

        const appointments = await AppointmentService.list(user!, { petId, myAppointments });
        return NextResponse.json(appointments);
    }, { requireAuth: true }),

    update: apiHandler(async (req, { user, params }) => {
        const body = await req.json();
        const id = params?.id;
        if (!id) throw new AppError("El ID es requerido", 400);

        const data = updateAppointmentSchema.parse(body);
        const updated = await AppointmentService.update(id, data as any, user!);

        return NextResponse.json(updated);
    }, { requireAuth: true }),

    getById: apiHandler(async (req, { user, params }) => {
        const id = params?.id;
        if (!id) throw new AppError("El ID es requerido", 400);

        const appointment = await AppointmentService.getById(id, user!);
        return NextResponse.json(appointment);
    }, { requireAuth: true }),

    delete: apiHandler(async (req, { user, params }) => {
        const id = params?.id;
        if (!id) throw new AppError("El ID es requerido", 400);

        await AppointmentService.delete(id, user!);
        return NextResponse.json({ message: "Cita eliminada correctamente" });
    }, { requireAuth: true }),
};
