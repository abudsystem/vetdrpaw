import React from 'react';
import { Button } from '@/components/ui/Button';
import { Pet } from '@/types/pet';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Card } from '@/components/ui/Card';
import { PetMobileCard } from './PetMobileCard';
import { Pagination } from '@/components/ui/Pagination';
import { usePagination } from '@/hooks/usePagination';
import { useTranslations } from 'next-intl';

interface PetListProps {
    pets: Pet[];
    onEdit: (pet: Pet) => void;
    onDelete: (id: string) => void;
    showForm: boolean;
}

export const PetList = ({ pets, onEdit, onDelete, showForm }: PetListProps) => {
    const t = useTranslations('ClientPanel');
    const {
        paginatedItems: paginatedPets,
        currentPage,
        totalPages,
        totalItems,
        handlePageChange
    } = usePagination(pets, 9); // Use 9 for grid/list (3x3) or 10, keeping it consistently pagination-friendly

    const getSpeciesEmoji = (especie: string) => {
        const especieLower = especie.toLowerCase();
        if (especieLower.includes('perro')) return '🐕';
        if (especieLower.includes('gato')) return '🐈';
        return '🐾';
    };

    if (pets.length === 0 && !showForm) {
        return <p className="text-gray-700 text-center py-8">{t('pets.noPets')}</p>;
    }

    return (
        <div className="space-y-6">
            {/* Mobile View (stacked cards) */}
            <div className="md:hidden space-y-4">
                {paginatedPets.map((pet) => (
                    <PetMobileCard
                        key={pet._id}
                        pet={pet}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </div>

            {/* Desktop View (Table) */}
            <Card className="hidden md:block overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('pets.table.pet')}</TableHead>
                            <TableHead>{t('pets.table.details')}</TableHead>
                            <TableHead>{t('pets.table.features')}</TableHead>
                            <TableHead>{t('pets.table.health')}</TableHead>
                            <TableHead>{t('common.actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedPets.map((pet) => (
                            <TableRow key={pet._id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl">{getSpeciesEmoji(pet.especie)}</div>
                                        <div>
                                            <div className="font-bold text-gray-900">{pet.nombre}</div>
                                            <span className="text-xs px-2 py-0.5 bg-teal-100 text-teal-800 rounded-full">
                                                {pet.especie}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm text-gray-600">
                                        <p><span className="font-medium">{t('pets.table.breed')}:</span> {pet.raza}</p>
                                        <p><span className="font-medium">{t('pets.table.age')}:</span> {pet.edad} años</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm text-gray-600">
                                        {pet.sexo && <p>{pet.sexo}</p>}
                                        {pet.peso && <p>{pet.peso} kg</p>}
                                        {pet.color && <p>{pet.color}</p>}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm">
                                        {pet.esterilizado && <p className="text-blue-600 text-xs">✓ {t('pets.table.sterilized')}</p>}
                                        {pet.alergias && pet.alergias.length > 0 && (
                                            <p className="text-red-600 text-xs truncate max-w-[150px]" title={pet.alergias.join(", ")}>
                                                ⚠ {pet.alergias.length} {t('pets.table.allergies')}
                                            </p>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onEdit(pet)}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            {t('common.edit')}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onDelete(pet._id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            {t('common.delete')}
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
