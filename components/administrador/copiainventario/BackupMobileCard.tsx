import { Badge } from '@/components/ui/Badge';

interface Backup {
    _id: string;
    filename: string;
    type: 'MANUAL' | 'DAILY' | 'WEEKLY';
    createdBy: string | { name: string };
    recordCount: number;
    fileSize: number;
    createdAt: string;
}

interface BackupMobileCardProps {
    backup: Backup;
    formatBytes: (bytes: number) => string;
    onDelete: (id: string) => void;
}

export const BackupMobileCard = ({ backup, formatBytes, onDelete }: BackupMobileCardProps) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-semibold text-gray-900 break-all">{backup.filename}</h3>
                    <p className="text-xs text-gray-700 mt-1">
                        {new Date(backup.createdAt).toLocaleString()}
                    </p>
                </div>
                <Badge variant={backup.type === 'MANUAL' ? 'info' : 'success'}>
                    {backup.type}
                </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                <div className="flex flex-col">
                    <span className="text-xs text-gray-700">Registros</span>
                    <span className="font-medium">{backup.recordCount}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-gray-700">Tamaño</span>
                    <span className="font-medium">{formatBytes(backup.fileSize)}</span>
                </div>
                <div className="flex flex-col col-span-2 mt-2 pt-2 border-t border-gray-200">
                    <span className="text-xs text-gray-700">Creado Por</span>
                    <span className="font-medium">{typeof backup.createdBy === 'object' ? backup.createdBy.name : backup.createdBy}</span>
                </div>
            </div>

            <div className="flex justify-end mt-4 pt-3 border-t border-gray-100">
                <button
                    onClick={() => onDelete(backup._id)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none w-full justify-center"
                >
                    Eliminar
                </button>
            </div>
        </div>
    );
};
