import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { GalleryMobileCard } from './GalleryMobileCard';
import { Pagination } from '@/components/ui/Pagination';
import { usePagination } from '@/hooks/usePagination';
import { useTranslations } from 'next-intl';

interface GalleryImage {
    _id: string;
    title: string;
    imageUrl: string;
    createdAt: string;
}

interface GalleryListProps {
    images: GalleryImage[];
    onDelete: (id: string) => void;
}

export const GalleryList = ({ images, onDelete }: GalleryListProps) => {
    const t = useTranslations('AdminDashboard.gallery');
    const tc = useTranslations('ClientPanel.common');

    const {
        paginatedItems: paginatedImages,
        currentPage,
        totalPages,
        totalItems,
        handlePageChange
    } = usePagination(images, 10);

    if (images.length === 0) {
        return (
            <Card className="p-8 text-center text-gray-700 font-bold">
                {t('noImages')}
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* Mobile View */}
            <div className="md:hidden space-y-4">
                {paginatedImages.map((img) => (
                    <GalleryMobileCard
                        key={img._id}
                        image={img}
                        onDelete={onDelete}
                    />
                ))}
            </div>

            {/* Desktop View */}
            <Card className="hidden md:block overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-bold">{t('table.preview')}</TableHead>
                            <TableHead className="font-bold">{t('table.title')}</TableHead>
                            <TableHead className="font-bold">{t('table.date')}</TableHead>
                            <TableHead className="font-bold">{tc('actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedImages.map((img) => (
                            <TableRow key={img._id}>
                                <TableCell>
                                    <Image
                                        src={img.imageUrl}
                                        alt={img.title}
                                        width={64}
                                        height={64}
                                        className="h-16 w-16 object-cover rounded-md border"
                                    />
                                </TableCell>
                                <TableCell className="font-bold text-gray-900">{img.title}</TableCell>
                                <TableCell className="text-gray-700 font-bold">
                                    {new Date(img.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDelete(img._id)}
                                        className="text-red-600 hover:text-red-800 font-bold"
                                    >
                                        {tc('delete')}
                                    </Button>
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
