import { PetController } from "@/controllers/pet.controller";
import { apiHandler } from "@/lib/api-handler";

export const POST = apiHandler(async (req, ctx) => {
    const body = await req.json();
    // Adaptación: el frontend envía ownerId, el controlador espera propietario
    const adaptedBody = {
        ...body,
        propietario: body.ownerId || body.propietario
    };
    const modReq = new Request(req.url, {
        method: "POST",
        body: JSON.stringify(adaptedBody),
        headers: req.headers
    });
    return PetController.create(modReq, ctx);
}, { requiredRoles: ["veterinario"] });
