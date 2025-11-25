import { MedicalRecord, IMedicalRecord } from "@/models/MedicalRecord";
import dbConnect from "@/lib/db";

export const MedicalRecordRepository = {
    create: async (data: Partial<IMedicalRecord>): Promise<IMedicalRecord> => {
        await dbConnect();
        return MedicalRecord.create(data);
    },
    findByPet: async (petId: string): Promise<IMedicalRecord[]> => {
        await dbConnect();
        return MedicalRecord.find({ pet: petId })
            .populate("veterinarian", "name email")
            .sort({ date: -1 });
    },
};
