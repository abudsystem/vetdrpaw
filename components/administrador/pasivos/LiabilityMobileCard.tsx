import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
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

interface LiabilityMobileCardProps {
    liability: Liability;
    onDelete: (id: string) => void;
}

export const LiabilityMobileCard = ({ liability, onDelete }: LiabilityMobileCardProps) => {
    const t = useTranslations('AdminDashboard.liabilities');
    const tc = useTranslations('ClientPanel.common');

    return (
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <Badge variant={liability.type === 'PRESTAMO' ? 'info' : 'default'} className="mb-1 font-bold">
                        {t(`types.${liability.type === 'PRESTAMO' ? 'loan' : 'obligation'}`)}
                    </Badge>
                    <h3 className="font-bold text-gray-900">{liability.description}</h3>
                    <p className="text-xs text-gray-700 mt-0.5 font-bold">
                        {t('table.startDate', { date: new Date(liability.startDate).toLocaleDateString() })}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-lg font-bold text-red-600">${liability.pendingAmount.toLocaleString()}</p>
                    <p className="text-xs text-gray-700 font-bold">{t('pendingLabel')}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                <div className="flex flex-col">
                    <span className="text-xs text-gray-700 font-bold">{t('table.amount')}</span>
                    <span className="font-bold">${liability.amount.toLocaleString()}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-gray-700 font-bold">{t('table.interestLabel')}</span>
                    <span className="font-bold">{liability.interestRate}%</span>
                </div>
                <div className="flex flex-col mt-2">
                    <span className="text-xs text-gray-700 font-bold">{t('table.monthlyPayment')}</span>
                    <span className="font-bold text-gray-900">${liability.monthlyPayment.toLocaleString()}</span>
                </div>
                <div className="flex flex-col mt-2">
                    <span className="text-xs text-gray-700 font-bold">{t('table.term')}</span>
                    <span className="font-bold">{liability.termMonths} {t('months', { count: liability.termMonths })}</span>
                </div>

                <div className="flex flex-col col-span-2 mt-2 pt-2 border-t border-gray-200 items-center">
                    <Badge variant={liability.status === 'ACTIVO' ? 'warning' : 'success'} className="font-bold">
                        {t(`status.${liability.status === 'ACTIVO' ? 'active' : 'paid'}`)}
                    </Badge>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-gray-100">
                <Link
                    href={`/administrador/pasivos/${liability._id}`}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-bold rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                    {tc('edit')}
                </Link>
                <button
                    onClick={() => onDelete(liability._id)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-bold rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none"
                >
                    {tc('delete')}
                </button>
            </div>
        </div>
    );
};
