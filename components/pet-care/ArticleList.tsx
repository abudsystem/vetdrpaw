'use client';
import React, { useEffect, useState } from "react";
import { ArticleCard, Article } from "./ArticleCard";
import { useTranslations } from 'next-intl';
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export const ArticleList = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const t = useTranslations('PetCare');

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const res = await fetch("/api/pet-care");
                if (res.ok) {
                    const data = await res.json();
                    setArticles(data);
                }
            } catch (error) {
                console.error("Error fetching articles:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center p-20">
                <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
            </div>
        );
    }

    if (articles.length === 0) {
        return (
            <div className="text-center p-12 bg-white rounded-[2rem] shadow-sm border border-gray-100 mt-12">
                <p className="text-gray-500 font-medium text-lg">{t('noArticles')}</p>
            </div>
        );
    }

    return (
        <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-2">
            {articles.map((article, index) => (
                <motion.div
                    key={article.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                    <ArticleCard article={article} />
                </motion.div>
            ))}
        </div>
    );
};
