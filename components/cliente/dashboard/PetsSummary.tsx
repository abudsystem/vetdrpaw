import Link from 'next/link';
import React from 'react';
import { Pet } from '@/types/pet';
import { useTranslations } from 'next-intl';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { PawPrint, Plus } from 'lucide-react';

export const PetsSummary = ({ pets, loading }: { pets: Pet[], loading?: boolean }) => {
    const t = useTranslations('ClientPanel.dashboard');
    const tc = useTranslations('ClientPanel.common');

    const getSpeciesEmoji = (especie: string) => {
        const especieLower = especie.toLowerCase();
        if (especieLower.includes('perro')) return '🐕';
        if (especieLower.includes('gato')) return '🐈';
        return '🐾';
    };

    return (
        <Card className="border-none shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between border-none bg-transparent pb-2">
                <CardTitle className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                    <PawPrint className="w-6 h-6 text-teal-500" />
                    {tc('pets') || 'Mis Mascotas'}
                </CardTitle>
                <Link href="/cliente/mascotas" className="group text-sm font-extrabold text-teal-600 flex items-center gap-1 hover:text-teal-700 transition-colors">
                    {tc('viewAll')}
                    <span className="text-lg transition-transform group-hover:translate-x-1">→</span>
                </Link>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex items-center gap-4">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-3 w-1/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : pets.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
                        <div className="bg-white p-4 rounded-full shadow-sm inline-block mb-4">
                            <PawPrint className="w-10 h-10 text-gray-300" />
                        </div>
                        <p className="text-gray-500 font-bold text-lg mb-6">{t('noPets')}</p>
                        <Link
                            href="/cliente/mascotas"
                            className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-500/20 active:scale-95"
                        >
                            <Plus className="w-5 h-5" />
                            {t('registerFirst')}
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pets.map((pet) => (
                            <Link
                                key={pet._id}
                                href={`/cliente/mascotas`}
                                className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-teal-100 hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
                                        {getSpeciesEmoji(pet.especie)}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-extrabold text-gray-900 group-hover:text-teal-600 transition-colors">
                                            {pet.nombre}
                                        </h3>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{pet.especie}</p>
                                        {pet.edad !== undefined && (
                                            <p className="text-sm font-bold text-gray-600 mt-1">
                                                {pet.edad} <span className="text-gray-400">{pet.edad === 1 ? tc('year') : tc('years')}</span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
