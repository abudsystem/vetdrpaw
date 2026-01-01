import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface Asset {
    _id: string;
    name: string;
    category: string;
    quantity: number;
    unitCost: number;
    totalValue: number;
    acquisitionDate: string;
    isDepreciable: boolean;
}

interface AssetMobileCardProps {
    asset: Asset;
    onDelete: (id: string) => void;
}

export const AssetMobileCard = ({ asset, onDelete }: AssetMobileCardProps) => {
    const t = useTranslations('AdminDashboard.assets');
    const tc = useTranslations('ClientPanel.common');

    return (
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-bold text-gray-900">{asset.name}</h3>
                    <p className="text-sm text-gray-700 mt-1 font-bold">{asset.category}</p>
                </div>
                <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">${asset.totalValue.toLocaleString()}</p>
                    <p className="text-xs text-gray-700 font-bold">{t('mobile.totalValueLabel')}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                <div className="flex flex-col">
                    <span className="text-xs text-gray-700 font-bold">{t('table.quantity')}</span>
                    <span className="font-bold">{asset.quantity}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-gray-700 font-bold">{t('table.unitCost')}</span>
                    <span className="font-bold">${asset.unitCost.toLocaleString()}</span>
                </div>
                <div className="flex flex-col col-span-2 mt-2 pt-2 border-t border-gray-200">
                    <span className="text-xs text-gray-700 font-bold">{t('table.acquisition')}</span>
                    <span className="font-bold">{new Date(asset.acquisitionDate).toLocaleDateString()}</span>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-gray-100">
                <Link
                    href={`/administrador/activos/${asset._id}`}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-bold rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                    {tc('edit')}
                </Link>
                <button
                    onClick={() => onDelete(asset._id)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-bold rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none"
                >
                    {tc('delete')}
                </button>
            </div>
        </div>
    );
};
