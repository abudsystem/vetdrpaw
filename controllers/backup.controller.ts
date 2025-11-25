import { Backup, IBackup } from "@/models/Backup";
import { Product } from "@/models/Product";
import { apiHandler, AppError } from "@/lib/api-handler";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";

export const BackupController = {
    // List all backups
    list: apiHandler(async (req: Request) => {
        await connectDB();
        const backups = await Backup.find({}).sort({ createdAt: -1 });
        return NextResponse.json(backups);
    }),

    // Create manual backup (generate CSV)
    create: apiHandler(async (req: Request) => {
        await connectDB();
        const body = await req.json();
        const { createdBy } = body;

        if (!createdBy) throw new AppError("createdBy is required", 400);

        // Get all products for backup
        const products = await Product.find({});

        // Generate CSV content
        const header = [
            'Nombre',
            'Descripción',
            'Categoría',
            'Cantidad',
            'Stock Mínimo',
            'Costo Unitario',
            'Precio Venta',
            'Proveedor',
            'Ubicación'
        ].join(',');

        const rows = products.map(p => [
            `"${p.name}"`,
            `"${p.description || ''}"`,
            `"${p.category}"`,
            p.quantity,
            p.minStock,
            p.unitCost,
            p.salePrice,
            `"${p.provider || ''}"`,
            `"${p.location || ''}"`
        ].join(','));

        const csvContent = [header, ...rows].join('\n');
        const fileSize = Buffer.byteLength(csvContent, 'utf8');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `inventory-backup-${timestamp}.csv`;

        // Create backup record
        const backup = await Backup.create({
            filename,
            type: 'MANUAL',
            createdBy,
            recordCount: products.length,
            fileSize
        });

        // Return both the backup record and CSV content
        return NextResponse.json({
            backup,
            csvContent,
            filename
        }, { status: 201 });
    }),

    // Delete backup
    delete: apiHandler(async (req: Request) => {
        await connectDB();
        const url = new URL(req.url);
        const id = url.pathname.split('/').pop();

        if (!id) throw new AppError("ID requerido", 400);

        const backup = await Backup.findByIdAndDelete(id);
        if (!backup) throw new AppError("Backup no encontrado", 404);

        return NextResponse.json({ message: "Backup eliminado" });
    }),
};
