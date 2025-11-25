import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Pet } from "@/models/Pet";
import { User } from "@/models/User";

export async function GET(req: Request) {
    try {
        await connectDB();

        // Fetch one pet with population
        const pet = await Pet.findOne().populate("propietario");

        if (!pet) {
            return NextResponse.json({ message: "No pets found" });
        }

        return NextResponse.json({
            pet: pet,
            propietario_raw: pet.propietario,
            propietario_type: typeof pet.propietario,
            is_populated: pet.propietario instanceof User || (pet.propietario && typeof pet.propietario === 'object' && 'name' in pet.propietario)
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
}
