import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Appointment } from "@/models/Appointment";
import { authMiddleware } from "@/middleware/auth.middleware";
import { AppointmentController } from "@/controllers/appointment.controller";

export async function GET(req: Request) {
    await connectDB();
    const user = await authMiddleware(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const myAppointments = searchParams.get("my_appointments");
    const petId = searchParams.get("petId");

    // 1. Filter by Specific Pet (Priority)
    if (petId) {
        const query: any = { pet: petId };
        const appointments = await Appointment.find(query)
            .populate("pet", "nombre especie propietario")
            .populate("veterinarian", "name email")
            .sort({ date: -1 });

        // Security: If client, ensure they own the pet
        if (user.role === "cliente") {
            const filtered = appointments.filter(a => a.pet && a.pet.propietario.toString() === user.id);
            return NextResponse.json(filtered);
        }

        return NextResponse.json(appointments);
    }

    // 2. "My Appointments" Filter
    if (myAppointments === "true" || user.role === "cliente") {
        if (user.role === "veterinario") {
            // For Vets: Appointments assigned to them
            const appointments = await Appointment.find({ veterinarian: user.id })
                .populate("pet", "nombre especie propietario")
                .populate("veterinarian", "name email")
                .sort({ date: -1 });
            return NextResponse.json(appointments);
        }

        // For Clients: Appointments for their pets
        const appointments = await Appointment.find()
            .populate({ path: "pet", match: { propietario: user.id }, select: "nombre especie propietario" })
            .populate("veterinarian", "name email")
            .sort({ date: -1 });

        const filtered = appointments.filter(a => a.pet);
        return NextResponse.json(filtered);
    }

    // 3. List All (administrador/Vet only)
    if (user.role === "veterinario" || user.role === "administrador") {
        return AppointmentController.list(req);
    }

    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function POST(req: Request) {
    await connectDB();
    const user = await authMiddleware(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Allow Vets and Clients to create
    return AppointmentController.create(req);
}

export async function PUT(req: Request) {
    await connectDB();
    const user = await authMiddleware(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    return AppointmentController.update(req);
}

export async function PATCH(req: Request) {
    await connectDB();
    const user = await authMiddleware(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    return AppointmentController.update(req);
}
