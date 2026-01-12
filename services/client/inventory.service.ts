import { Product } from '@/types/product';

const API_URL = '/api/inventory';

export const InventoryServices = {
    async getInventoryProducts(search: string, filter: string): Promise<Product[]> {
        let url = `${API_URL}?search=${encodeURIComponent(search)}`;
        if (filter === "lowStock") url += "&lowStock=true";
        if (filter === "expiring") url += "&expiring=true";

        const res = await fetch(url);
        if (!res.ok) throw new Error('Error fetching inventory');
        return res.json();
    }
};
