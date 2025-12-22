'use client';
import React, { useEffect, useState } from "react";
import { ArticleCard, Article } from "./ArticleCard";
import { useTranslations } from "next-intl";

export const ArticleList = () => {
    const t = useTranslations("PetCare");
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

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
            <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    if (articles.length === 0) {
        return (
            <div className="text-center p-12 bg-white rounded-lg shadow mt-12">
                <p className="text-gray-500">{t("noArticles")}</p>
            </div>
        );
    }

    return (
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {articles.map((article) => (
                <ArticleCard key={article.title} article={article} />
            ))}
        </div>
    );
};
