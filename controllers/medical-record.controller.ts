import { MedicalRecordService } from "@/services/medical-record.service";
import { NextResponse } from "next/server";
import { apiHandler, AppError } from "@/lib/api-handler";
import { z } from "zod";

const vacunaSchema = z.object({
    nombre: z.string().min(1),
    fecha: z.string().or(z.date()).transform((val) => new Date(val)),
    proximaDosis: z.string().or(z.date()).transform((val) => new Date(val)).optional(),
    lote: z.string().optional(),
    veterinario: z.string().optional(),
});

const createRecordSchema = z.object({
    pet: z.string(),
    appointment: z.string().optional(),
    motivo: z.string().min(1),
    diagnosis: z.string().min(1),
    treatment: z.string().min(1),
    receta: z.string().optional(),
    notes: z.string().optional(),
    proximaVisita: z.string().or(z.date()).transform((val) => new Date(val)).optional(),
    vacunas: z.array(vacunaSchema).optional(),
    peso: z.number().positive().optional(),
    temperatura: z.number().optional(),
});

export const MedicalRecordController = {
    create: apiHandler(async (req: Request) => {
        const body = await req.json();

        // Auto-assign vet from token (middleware should have handled auth)
        const { cookies } = await import("next/headers");
        const { verifyToken } = await import("@/lib/jwt");
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) throw new AppError("Unauthorized", 401);
        const decoded = verifyToken(token);

        const data = createRecordSchema.parse(body);

        const record = await MedicalRecordService.create({
            ...data,
            veterinarian: decoded.id,
        } as any);

        return NextResponse.json(record, { status: 201 });
    }),

    listByPet: apiHandler(async (req: Request) => {
        const { searchParams } = new URL(req.url);
        const petId = searchParams.get("petId");

        if (!petId) throw new AppError("Pet ID is required", 400);

        const records = await MedicalRecordService.findByPet(petId);
        return NextResponse.json(records);
    }),

    update: apiHandler(async (req: Request) => {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) throw new AppError("ID requerido", 400);

        const body = await req.json();
        const data = createRecordSchema.partial().parse(body);

        const record = await MedicalRecordService.update(id, data as any);

        if (!record) throw new AppError("Registro médico no encontrado", 404);

        return NextResponse.json(record);
    }),

    delete: apiHandler(async (req: Request) => {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) throw new AppError("ID requerido", 400);

        await MedicalRecordService.delete(id);

        return NextResponse.json({ message: "Registro médico eliminado" });
    }),
};
