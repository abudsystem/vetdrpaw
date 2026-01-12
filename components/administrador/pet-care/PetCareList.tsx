"use client";

import React from "react";
import { PetCareItem } from "@/hooks/usePetCare";
import { Edit, Trash2, ExternalLink, FileText } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

interface PetCareListProps {
    articles: PetCareItem[];
    onEdit: (article: PetCareItem) => void;
    onDelete: (id: string) => void;
}

export const PetCareList = ({ articles, onEdit, onDelete }: PetCareListProps) => {
    const t = useTranslations('AdminDashboard.petCare');
    const tc = useTranslations('ClientPanel.common');
    const locale = useLocale();
    const currentLang = (locale === 'en' || locale === 'es') ? locale : 'es';

    if (articles.length === 0) {
        return (
            <div className="text-center p-12 bg-white/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center">
                <div className="bg-teal-50 p-4 rounded-full mb-4">
                    <FileText className="w-12 h-12 text-teal-500" />
                </div>
                <p className="text-gray-500 font-bold text-lg">{t('noArticles')}</p>
                <p className="text-gray-400 text-sm mt-1">Comienza agregando tu primer artículo educativo.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr className="bg-gray-50 text-left">
                        <th className="py-3 px-4 border-b font-bold text-gray-700">{t('table.title')}</th>
                        <th className="py-3 px-4 border-b font-bold text-gray-700">{t('table.category')}</th>
                        <th className="py-3 px-4 border-b font-bold text-gray-700">{t('table.date')}</th>
                        <th className="py-3 px-4 border-b font-bold text-gray-700 text-center">{t('table.link')}</th>
                        <th className="py-3 px-4 border-b font-bold text-gray-700 text-right">{tc('actions')}</th>
                    </tr>
                </thead>
                <tbody>
                    {articles.map((article) => (
                        <tr key={article._id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4 border-b text-gray-800 font-bold">
                                {article.title[currentLang]}
                            </td>
                            <td className="py-3 px-4 border-b text-gray-700">
                                <span className="px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded-full font-bold">
                                    {article.category[currentLang]}
                                </span>
                            </td>
                            <td className="py-3 px-4 border-b text-gray-600 text-sm font-bold">
                                {article.date}
                            </td>
                            <td className="py-3 px-4 border-b text-center">
                                <a
                                    href={article.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-teal-600 hover:text-teal-800 inline-flex items-center"
                                >
                                    <ExternalLink size={16} />
                                </a>
                            </td>
                            <td className="py-3 px-4 border-b text-right">
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => onEdit(article)}
                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                        title={tc('edit')}
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirm(t('confirmDelete'))) {
                                                onDelete(article._id);
                                            }
                                        }}
                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                        title={tc('delete')}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
