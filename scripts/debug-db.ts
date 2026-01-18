import { Pet } from "../models/Pet";
import { User } from "../models/User";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
if (!process.env.MONGODB_URI) {
    dotenv.config({ path: ".env" });
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("Please define the MONGODB_URI environment variable inside .env.local");
    process.exit(1);
}

async function debug() {
    try {
        await mongoose.connect(MONGODB_URI!);
        console.log("Connected to DB");

        const pets = await Pet.find().populate("propietario");
        console.log(`Found ${pets.length} pets`);

        if (pets.length > 0) {
            const p = pets[0];
            console.log("First Pet:", JSON.stringify(p, null, 2));
            console.log("Propietario populated?", p.propietario);
        } else {
            console.log("No pets found.");
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

debug();
