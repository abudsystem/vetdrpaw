import { MedicalRecord, IMedicalRecord } from "@/models/MedicalRecord";
import { apiHandler, AppError } from "@/lib/api-handler";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { z } from "zod";

// Validation schemas
const vacunaSchema = z.object({
    nombre: z.string().min(1),
    fecha: z.string().or(z.date()).transform((val) => new Date(val)),
    proximaDosis: z.string().or(z.date()).transform((val) => new Date(val)).optional(),
    lote: z.string().optional(),
    veterinario: z.string().optional(),
});

const createMedicalRecordSchema = z.object({
    pet: z.string(),
    appointment: z.string().optional(),
    veterinarian: z.string(),
    date: z.string().or(z.date()).transform((val) => new Date(val)).optional(),
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
    // List all medical records (with optional filter by pet)
    list: apiHandler(async (req: Request) => {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const petId = searchParams.get("pet");

        const filter = petId ? { pet: petId } : {};
        const records = await MedicalRecord.find(filter)
            .populate("pet", "nombre especie")
            .populate("veterinarian", "name")
            .sort({ date: -1 });

        return NextResponse.json(records);
    }),

    // Get single medical record
    getById: apiHandler(async (req: Request) => {
        await connectDB();
        const url = new URL(req.url);
        const id = url.pathname.split('/').pop();

        if (!id) throw new AppError("ID requerido", 400);

        const record = await MedicalRecord.findById(id)
            .populate("pet", "nombre especie raza edad")
            .populate("veterinarian", "name")
            .populate("appointment");

        if (!record) throw new AppError("Registro médico no encontrado", 404);

        return NextResponse.json(record);
    }),

    // Create new medical record
    create: apiHandler(async (req: Request) => {
        await connectDB();
        const body = await req.json();
        const data = createMedicalRecordSchema.parse(body);

        const record = await MedicalRecord.create(data);

        return NextResponse.json(record, { status: 201 });
    }),

    // Update medical record
    update: apiHandler(async (req: Request) => {
        await connectDB();
        const url = new URL(req.url);
        const id = url.pathname.split('/').pop();

        if (!id) throw new AppError("ID requerido", 400);

        const body = await req.json();
        const data = createMedicalRecordSchema.partial().parse(body);

        const record = await MedicalRecord.findByIdAndUpdate(
            id,
            data,
            { new: true, runValidators: true }
        );

        if (!record) throw new AppError("Registro médico no encontrado", 404);

        return NextResponse.json(record);
    }),

    // Delete medical record
    delete: apiHandler(async (req: Request) => {
        await connectDB();
        const url = new URL(req.url);
        const id = url.pathname.split('/').pop();

        if (!id) throw new AppError("ID requerido", 400);

        const record = await MedicalRecord.findByIdAndDelete(id);
        if (!record) throw new AppError("Registro médico no encontrado", 404);

        return NextResponse.json({ message: "Registro médico eliminado" });
    }),
};
