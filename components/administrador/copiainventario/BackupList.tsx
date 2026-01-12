import React from 'react';
import { Card } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { BackupMobileCard } from './BackupMobileCard';
import { Pagination } from '@/components/ui/Pagination';
import { usePagination } from '@/hooks/usePagination';
import { useTranslations } from 'next-intl';

interface Backup {
    _id: string;
    filename: string;
    type: 'MANUAL' | 'DAILY' | 'WEEKLY';
    createdBy: string;
    recordCount: number;
    fileSize: number;
    createdAt: string;
}

interface BackupListProps {
    backups: Backup[];
    formatBytes: (bytes: number) => string;
    onDelete: (id: string) => void;
}

export const BackupList = ({ backups, formatBytes, onDelete }: BackupListProps) => {
    const t = useTranslations('AdminDashboard.inventoryBackup');
    const {
        paginatedItems: paginatedBackups,
        currentPage,
        totalPages,
        totalItems,
        handlePageChange
    } = usePagination(backups, 10);

    if (backups.length === 0) {
        return (
            <div className="p-6 text-center text-gray-700 bg-white rounded-lg shadow">
                {t('noCopies')}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Mobile View */}
            <div className="md:hidden space-y-4">
                {paginatedBackups.map((backup) => (
                    <BackupMobileCard
                        key={backup._id}
                        backup={backup}
                        formatBytes={formatBytes}
                        onDelete={onDelete}
                    />
                ))}
            </div>

            {/* Desktop View */}
            <Card className="hidden md:block overflow-hidden overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('table.file')}</TableHead>
                            <TableHead>{t('table.type')}</TableHead>
                            <TableHead>{t('table.date')}</TableHead>
                            <TableHead>{t('table.createdBy')}</TableHead>
                            <TableHead>{t('table.recordCount')}</TableHead>
                            <TableHead>{t('table.fileSize')}</TableHead>
                            <TableHead className="text-right">{t('table.actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedBackups.map((backup) => (
                            <TableRow key={backup._id} className="hover:bg-gray-50">
                                <TableCell>
                                    <div className="text-sm font-medium text-gray-900">{backup.filename}</div>
                                </TableCell>
                                <TableCell>
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${backup.type === 'MANUAL'
                                        ? 'bg-blue-100 text-blue-800'
                                        : backup.type === 'DAILY'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-purple-100 text-purple-800'
                                        }`}>
                                        {backup.type}
                                    </span>
                                </TableCell>
                                <TableCell className="text-sm text-gray-700">
                                    {new Date(backup.createdAt).toLocaleString()}
                                </TableCell>
                                <TableCell className="text-sm text-gray-700">
                                    {backup.createdBy}
                                </TableCell>
                                <TableCell className="text-sm text-gray-700">
                                    {backup.recordCount} {t('table.products')}
                                </TableCell>
                                <TableCell className="text-sm text-gray-700">
                                    {formatBytes(backup.fileSize)}
                                </TableCell>
                                <TableCell className="text-right text-sm font-medium">
                                    <button
                                        onClick={() => onDelete(backup._id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        {t('table.delete')}
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                onPageChange={handlePageChange}
            />
        </div>
    );
};
