import { CalendarEventService } from "@/services/calendar-event.service";
import { NextResponse } from "next/server";
import { apiHandler, AppError } from "@/lib/api-handler";
import { z } from "zod";

const calendarEventSchema = z.object({
    title: z.union([
        z.string(),
        z.object({
            es: z.string().min(1, "El título en español es requerido"),
            en: z.string().optional()
        })
    ]),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)"),
    description: z.union([
        z.string(),
        z.object({
            es: z.string().min(1, "La descripción en español es requerida"),
            en: z.string().optional()
        })
    ]),
    location: z.union([
        z.string(),
        z.object({
            es: z.string().optional(),
            en: z.string().optional()
        })
    ]).optional(),
});

export const CalendarEventController = {
    create: apiHandler(async (req: Request) => {
        const body = await req.json();
        const data = calendarEventSchema.parse(body);
        const item = await CalendarEventService.create(data as any);
        return NextResponse.json(item, { status: 201 });
    }, { requiredRoles: ["administrador"] }),

    listAll: apiHandler(async () => {
        const items = await CalendarEventService.listAll();
        return NextResponse.json(items);
    }),

    getOne: apiHandler(async (req, { params }) => {
        const id = params?.id;
        if (!id) throw new AppError("ID requerido", 400);

        const item = await CalendarEventService.getOne(id);
        if (!item) throw new AppError("Evento no encontrado", 404);
        return NextResponse.json(item);
    }),

    update: apiHandler(async (req, { params }) => {
        const id = params?.id;
        if (!id) throw new AppError("ID requerido", 400);

        const body = await req.json();
        const data = calendarEventSchema.partial().parse(body);
        const item = await CalendarEventService.update(id, data as any);
        if (!item) throw new AppError("Evento no encontrado", 404);
        return NextResponse.json(item);
    }, { requiredRoles: ["administrador"] }),

    delete: apiHandler(async (req, { params }) => {
        const id = params?.id;
        if (!id) throw new AppError("ID requerido", 400);

        const item = await CalendarEventService.delete(id);
        if (!item) throw new AppError("Evento no encontrado", 404);
        return NextResponse.json({ message: "Evento eliminado correctamente" });
    }, { requiredRoles: ["administrador"] }),
};
