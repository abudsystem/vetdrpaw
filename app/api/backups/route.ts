import { BackupController } from "@/controllers/backup.controller";

export const GET = BackupController.list;
export const POST = BackupController.create;
