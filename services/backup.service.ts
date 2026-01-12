import { BackupRepository } from "@/repositories/backup.repo";
import { InventoryRepository } from "@/repositories/inventory.repo";
import { AppError } from "@/lib/api-handler";

export const BackupService = {
    list: () => BackupRepository.find({}),

    createManualBackup: async (createdBy: string) => {
        const products = await InventoryRepository.findProducts({});

        const header = ['Nombre', 'Descripción', 'Categoría', 'Cantidad', 'Stock Mínimo', 'Costo Unitario', 'Precio Venta', 'Proveedor', 'Ubicación'].join(',');
        const rows = products.map(p => [
            `"${p.name}"`, `"${p.description || ''}"`, `"${p.category}"`, p.quantity, p.minStock, p.unitCost, p.salePrice, `"${p.provider || ''}"`, `"${p.location || ''}"`
        ].join(','));

        const csvContent = [header, ...rows].join('\n');
        const fileSize = Buffer.byteLength(csvContent, 'utf8');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `inventory-backup-${timestamp}.csv`;

        const backup = await BackupRepository.create({ filename, type: 'MANUAL', createdBy: createdBy as any, recordCount: products.length, fileSize });

        return { backup, csvContent, filename };
    },

    delete: async (id: string) => {
        const deleted = await BackupRepository.delete(id);
        if (!deleted) throw new AppError("Backup no encontrado", 404);
        return deleted;
    },
};
