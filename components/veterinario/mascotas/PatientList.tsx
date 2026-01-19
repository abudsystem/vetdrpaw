import Link from 'next/link';
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Pet } from '@/types/pet';
import { useTranslations } from 'next-intl';
import { calculateAge } from '@/lib/dateUtils';

interface PatientListProps {
    patients: Pet[];
}

export const PatientList = ({ patients = [] }: PatientListProps) => {
    const t = useTranslations('VetPanel.patients');
    const tc = useTranslations('ClientPanel.common');

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-black">{t('table.pet')}</TableHead>
                        <TableHead className="text-black">{t('table.speciesBreed')}</TableHead>
                        <TableHead className="text-black">{t('table.owner')}</TableHead>
                        <TableHead className="text-black">{tc('actions')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {patients.map((pet) => (
                        <TableRow key={pet._id}>
                            <TableCell className="whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{pet.nombre}</div>
                                <div className="text-sm text-gray-700">
                                    {calculateAge(pet.fechaNacimiento, pet.edad, tc)}
                                </div>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                                <div className="text-sm text-gray-900">{pet.especie}</div>
                                <div className="text-sm text-gray-700">{pet.raza}</div>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                                <div className="text-sm text-gray-900">{pet.propietario?.name || 'N/A'}</div>
                                <div className="text-sm text-gray-700">{pet.propietario?.email || 'N/A'}</div>
                            </TableCell>
                            <TableCell className="whitespace-nowrap text-sm font-medium">
                                <Link
                                    href={`/veterinario/mascotas/${pet._id}/historial`}
                                    className="text-indigo-600 hover:text-indigo-900 font-bold"
                                >
                                    {t('table.viewHistory')}
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
