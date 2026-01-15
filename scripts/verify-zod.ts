import { z } from "zod";

const createSaleSchema = z.object({
    products: z.array(z.object({
        product: z.string(),
        quantity: z.number().positive(),
        price: z.number().optional(),
    })).optional(),
    services: z.array(z.object({
        service: z.string(),
        quantity: z.number().positive(),
        price: z.number().optional(),
    })).optional(),
    paymentMethod: z.enum(['Efectivo', 'Tarjeta', 'Transferencia', 'Otro']),
    client: z.string().optional().nullable(),
    pet: z.string().optional().nullable(),
    appointment: z.string().optional().nullable(),
});

const validPayload = {
    products: [{ product: "123", quantity: 1, price: 10 }],
    paymentMethod: "Efectivo",
    client: null,
    pet: null,
    appointment: null
};

try {
    createSaleSchema.parse(validPayload);
    console.log("Validation passed!");
} catch (e) {
    console.error("Validation failed:", e);
}
