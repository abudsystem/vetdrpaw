import { BackupService } from "@/services/backup.service";
import { apiHandler, AppError } from "@/lib/api-handler";
import { NextResponse } from "next/server";

export const BackupController = {
    list: apiHandler(async () => {
        const backups = await BackupService.list();
        return NextResponse.json(backups);
    }, { requiredRoles: ['administrador'] }),

    create: apiHandler(async (req: Request, { user }) => {
        const result = await BackupService.createManualBackup(user!.id);
        return NextResponse.json(result, { status: 201 });
    }, { requiredRoles: ['administrador'] }),

    delete: apiHandler(async (req, { params }) => {
        const id = params?.id;
        if (!id) throw new AppError("ID requerido", 400);

        await BackupService.delete(id);
        return NextResponse.json({ message: "Backup eliminado" });
    }, { requiredRoles: ['administrador'] }),
};
