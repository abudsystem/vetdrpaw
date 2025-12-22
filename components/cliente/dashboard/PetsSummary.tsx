import Link from 'next/link';
import React from 'react';
import { Pet } from '@/types/pet';
import { useTranslations } from 'next-intl';

export const PetsSummary = ({ pets }: { pets: Pet[] }) => {
    const t = useTranslations('ClientPanel');

    const getSpeciesEmoji = (especie: string) => {
        const especieLower = especie.toLowerCase();
        if (especieLower.includes('perro')) return '🐕';
        if (especieLower.includes('gato')) return '🐈';
        return '🐾';
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">{t('dashboard.stats.pets')}</h2>
                <Link href="/cliente/mascotas" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                    {t('common.viewAll')}
                </Link>
            </div>

            {pets.length === 0 ? (
                <div className="text-center py-8 text-gray-700">
                    <p className="mb-4">{t('dashboard.noPets')}</p>
                    <Link
                        href="/cliente/mascotas"
                        className="inline-block bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
                    >
                        {t('dashboard.registerFirst')}
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pets.map((pet) => (
                        <Link
                            key={pet._id}
                            href={`/cliente/mascotas`}
                            className="p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-teal-300 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="text-4xl">
                                    {getSpeciesEmoji(pet.especie)}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-800 group-hover:text-teal-600">
                                        {pet.nombre}
                                    </h3>
                                    <p className="text-sm text-gray-600">{pet.especie}</p>
                                    {pet.edad !== undefined && (
                                        <p className="text-xs text-gray-700">{pet.edad} años</p>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};
