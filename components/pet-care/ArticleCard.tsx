import React from "react";
import { ArrowRight, Calendar, Tag } from "lucide-react";

export interface Article {
    title: string;
    excerpt: string;
    date: string;
    category: string;
    link: string;
}

export const ArticleCard = ({ article }: { article: Article }) => {
    return (
        <div
            className="bg-white rounded-[2rem] shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 group flex flex-col h-full"
        >
            <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-6">
                    <span className="px-4 py-1.5 bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-2">
                        <Tag className="w-3 h-3" />
                        {article.category}
                    </span>
                    <span className="text-gray-400 text-sm font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {article.date}
                    </span>
                </div>

                <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-teal-600 transition-colors tracking-tight">
                    {article.title}
                </h3>

                <p className="text-gray-600 mb-8 leading-relaxed font-medium flex-grow">
                    {article.excerpt}
                </p>

                <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-teal-600 font-bold hover:text-teal-800 transition-colors group/link mt-auto"
                >
                    Leer más
                    <ArrowRight className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" />
                </a>
            </div>
            <div className="h-1.5 w-full bg-gradient-to-r from-teal-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </div>
    );
};
