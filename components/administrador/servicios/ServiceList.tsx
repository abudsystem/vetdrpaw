import Link from 'next/link';
import React from 'react';
import { Service } from '@/types/service';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Card } from '@/components/ui/Card';
import { ServiceMobileCard } from './ServiceMobileCard';
import { Pagination } from '@/components/ui/Pagination';
import { usePagination } from '@/hooks/usePagination';
import { useTranslations } from 'next-intl';

interface ServiceListProps {
    services: Service[];
    onToggleStatus: (id: string) => void;
}

export const ServiceList = ({ services, onToggleStatus }: ServiceListProps) => {
    const t = useTranslations('AdminDashboard.services');
    const tc = useTranslations('ClientPanel.common');

    const {
        paginatedItems: paginatedServices,
        currentPage,
        totalPages,
        totalItems,
        handlePageChange
    } = usePagination(services, 10);

    if (services.length === 0) {
        return (
            <Card className="p-8 text-center text-gray-700 font-bold">
                {t('noServices')}
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* Mobile View */}
            <div className="md:hidden space-y-4">
                {paginatedServices.map((service) => (
                    <ServiceMobileCard
                        key={service._id}
                        service={service}
                        onToggleStatus={onToggleStatus}
                    />
                ))}
            </div>

            {/* Desktop View */}
            <Card className="hidden md:block overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('table.name')}</TableHead>
                            <TableHead>{t('table.basePrice')}</TableHead>
                            <TableHead>{t('table.duration')}</TableHead>
                            <TableHead>{t('table.supplies')}</TableHead>
                            <TableHead>{t('table.status')}</TableHead>
                            <TableHead>{t('table.actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedServices.map((service) => (
                            <TableRow key={service._id}>
                                <TableCell>
                                    <div className="font-bold text-gray-900">{service.name}</div>
                                    <div className="text-sm text-gray-700 truncate max-w-xs font-bold">
                                        {service.description}
                                    </div>
                                </TableCell>
                                <TableCell className="text-gray-900 font-bold">
                                    ${service.basePrice.toFixed(2)}
                                </TableCell>
                                <TableCell className="text-gray-900 font-bold">
                                    {service.duration}
                                </TableCell>
                                <TableCell className="text-gray-900 font-bold">
                                    {service.supplies?.length || 0}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={service.isActive ? "success" : "danger"}>
                                        {service.isActive ? t('status.active') : t('status.inactive')}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-2">
                                        <Link
                                            href={`/administrador/servicios/editar/${service._id}`}
                                            className="text-sm font-bold text-indigo-600 hover:text-indigo-900"
                                        >
                                            {tc('edit')}
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onToggleStatus(service._id)}
                                            className={service.isActive ? "text-red-600 hover:text-red-900 font-bold" : "text-green-600 hover:text-green-900 font-bold"}
                                        >
                                            {service.isActive ? t('actions.deactivate') : t('actions.activate')}
                                        </Button>
                                    </div>
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
