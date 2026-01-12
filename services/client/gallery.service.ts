import { api } from "@/lib/api";

export interface GalleryImage {
    _id: string;
    title: string | { es: string; en: string };
    imageUrl: string;
    createdAt: string;
}

export const GalleryService = {
    getAll: async (): Promise<GalleryImage[]> => {
        return await api("/api/admin/gallery");
    },

    create: async (data: { title: string | { es: string; en: string }; imageUrl: string }): Promise<GalleryImage> => {
        return await api("/api/admin/gallery", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    delete: async (id: string): Promise<void> => {
        await api(`/api/admin/gallery/${id}`, {
            method: "DELETE",
        });
    },
};
