import Link from 'next/link';
import React from 'react';
import { Card } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { LiabilityMobileCard } from './LiabilityMobileCard';
import { Pagination } from '@/components/ui/Pagination';
import { usePagination } from '@/hooks/usePagination';
import { useTranslations } from 'next-intl';

interface Liability {
    _id: string;
    type: 'PRESTAMO' | 'OBLIGACION';
    description: string;
    amount: number;
    startDate: string;
    interestRate: number;
    termMonths: number;
    amountPaid: number;
    status: 'ACTIVO' | 'PAGADO';
    pendingAmount: number;
    monthlyPayment: number;
}

interface LiabilityListProps {
    liabilities: Liability[];
    onDelete: (id: string) => void;
}

export const LiabilityList = ({ liabilities, onDelete }: LiabilityListProps) => {
    const t = useTranslations('AdminDashboard.liabilities');
    const tc = useTranslations('ClientPanel.common');

    const {
        paginatedItems: paginatedLiabilities,
        currentPage,
        totalPages,
        totalItems,
        handlePageChange
    } = usePagination(liabilities, 10);

    if (liabilities.length === 0) {
        return (
            <div className="p-6 text-center text-gray-700 bg-white rounded-lg shadow font-bold">
                {t('noLiabilities')}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Mobile View */}
            <div className="md:hidden space-y-4">
                {paginatedLiabilities.map((liability) => (
                    <LiabilityMobileCard
                        key={liability._id}
                        liability={liability}
                        onDelete={onDelete}
                    />
                ))}
            </div>

            {/* Desktop View */}
            <Card className="hidden md:block overflow-hidden overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-bold">{t('table.type')}</TableHead>
                            <TableHead className="font-bold">{t('table.description')}</TableHead>
                            <TableHead className="font-bold">{t('table.amount')}</TableHead>
                            <TableHead className="font-bold">{t('table.interest')}</TableHead>
                            <TableHead className="font-bold">{t('table.term')}</TableHead>
                            <TableHead className="font-bold">{t('table.pendingAmount')}</TableHead>
                            <TableHead className="font-bold">{t('table.monthlyPayment')}</TableHead>
                            <TableHead className="font-bold">{t('table.status')}</TableHead>
                            <TableHead className="text-right font-bold">{tc('actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedLiabilities.map((liability) => (
                            <TableRow key={liability._id} className="hover:bg-gray-50">
                                <TableCell>
                                    <span className={`px-2 inline-flex text-xs leading-5 font-bold rounded-full ${liability.type === 'PRESTAMO'
                                        ? 'bg-purple-100 text-purple-800'
                                        : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {t(`types.${liability.type === 'PRESTAMO' ? 'loan' : 'obligation'}`)}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm font-bold text-gray-900">{liability.description}</div>
                                    <div className="text-xs text-gray-700 font-bold">
                                        {t('table.startDate', { date: new Date(liability.startDate).toLocaleDateString() })}
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm text-gray-700 font-bold">
                                    ${liability.amount.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-sm text-gray-700 font-bold">
                                    {liability.interestRate}%
                                </TableCell>
                                <TableCell className="text-sm text-gray-700 font-bold">
                                    {liability.termMonths} {t('months', { count: liability.termMonths })}
                                </TableCell>
                                <TableCell className="text-sm font-bold text-red-600">
                                    ${liability.pendingAmount.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-sm text-gray-900 font-bold">
                                    ${liability.monthlyPayment.toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    <span className={`px-2 inline-flex text-xs leading-5 font-bold rounded-full ${liability.status === 'ACTIVO'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-green-100 text-green-800'
                                        }`}>
                                        {t(`status.${liability.status === 'ACTIVO' ? 'active' : 'paid'}`)}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right text-sm font-bold">
                                    <Link
                                        href={`/administrador/pasivos/${liability._id}`}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                        {tc('edit')}
                                    </Link>
                                    <button
                                        onClick={() => onDelete(liability._id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        {tc('delete')}
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
