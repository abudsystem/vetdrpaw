import { PetCareService } from "@/services/pet-care.service";
import { NextResponse } from "next/server";
import { apiHandler, AppError } from "@/lib/api-handler";
import { z } from "zod";

const petCareSchema = z.object({
    title: z.object({
        es: z.string().min(1, "El título en español es requerido"),
        en: z.string().min(1, "El título en inglés es requerido")
    }),
    excerpt: z.object({
        es: z.string().min(1, "El extracto en español es requerido"),
        en: z.string().min(1, "El extracto en inglés es requerido")
    }),
    category: z.object({
        es: z.string().min(1, "La categoría en español es requerida"),
        en: z.string().min(1, "La categoría en inglés es requerida")
    }),
    link: z.string().url("Debe ser una URL válida"),
    date: z.string().min(1, "La fecha es requerida"),
});

export const PetCareController = {
    create: apiHandler(async (req: Request) => {
        const body = await req.json();
        const data = petCareSchema.parse(body);
        const item = await PetCareService.create(data as any);
        return NextResponse.json(item, { status: 201 });
    }, { requiredRoles: ["administrador"] }),

    listAll: apiHandler(async () => {
        const items = await PetCareService.listAll();
        return NextResponse.json(items);
    }),

    getOne: apiHandler(async (req, { params }) => {
        const id = params?.id;
        if (!id) throw new AppError("ID requerido", 400);

        const item = await PetCareService.getOne(id);
        if (!item) throw new AppError("Artículo no encontrado", 404);
        return NextResponse.json(item);
    }),

    update: apiHandler(async (req, { params }) => {
        const id = params?.id;
        if (!id) throw new AppError("ID requerido", 400);

        const body = await req.json();
        const data = petCareSchema.partial().parse(body);
        const item = await PetCareService.update(id, data as any);
        if (!item) throw new AppError("Artículo no encontrado", 404);
        return NextResponse.json(item);
    }, { requiredRoles: ["administrador"] }),

    delete: apiHandler(async (req, { params }) => {
        const id = params?.id;
        if (!id) throw new AppError("ID requerido", 400);

        const item = await PetCareService.delete(id);
        if (!item) throw new AppError("Artículo no encontrado", 404);
        return NextResponse.json({ message: "Artículo eliminado correctamente" });
    }, { requiredRoles: ["administrador"] }),
};
