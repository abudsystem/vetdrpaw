import { useState, useEffect } from "react";

export interface PetCareItem {
    _id: string;
    title: { es: string; en: string };
    excerpt: { es: string; en: string };
    category: { es: string; en: string };
    link: string;
    date: string;
}

export const usePetCare = () => {
    const [articles, setArticles] = useState<PetCareItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchArticles = async () => {
        try {
            setLoading(true);
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

    useEffect(() => {
        fetchArticles();
    }, []);

    const createArticle = async (data: Omit<PetCareItem, "_id">) => {
        const res = await fetch("/api/pet-care", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (res.ok) {
            await fetchArticles();
            return true;
        }
        return false;
    };

    const updateArticle = async (id: string, data: Partial<PetCareItem>) => {
        const res = await fetch(`/api/pet-care/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (res.ok) {
            await fetchArticles();
            return true;
        }
        return false;
    };

    const deleteArticle = async (id: string) => {
        const res = await fetch(`/api/pet-care/${id}`, {
            method: "DELETE",
        });
        if (res.ok) {
            await fetchArticles();
            return true;
        }
        return false;
    };

    return {
        articles,
        loading,
        createArticle,
        updateArticle,
        deleteArticle,
        refresh: fetchArticles,
    };
};
