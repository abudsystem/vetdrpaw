import { Backup, IBackup } from "@/models/Backup";
import dbConnect from "@/lib/db";

export const BackupRepository = {
    find: async (query: any = {}) => {
        await dbConnect();
        return Backup.find(query).sort({ createdAt: -1 }).populate('createdBy', 'name');
    },
    findById: async (id: string) => {
        await dbConnect();
        return Backup.findById(id);
    },
    create: async (data: Partial<IBackup>) => {
        await dbConnect();
        return Backup.create(data);
    },
    delete: async (id: string) => {
        await dbConnect();
        return Backup.findByIdAndDelete(id);
    },
};
