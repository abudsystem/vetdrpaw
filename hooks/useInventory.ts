import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types/product';
import { InventoryServices } from "@/services/client/inventory.service";

export const useInventory = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all"); // all, lowStock, expiring

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await InventoryServices.getInventoryProducts(search, filter);
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    }, [search, filter]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return {
        products,
        loading,
        search,
        setSearch,
        filter,
        setFilter,
        refreshInventory: fetchProducts
    };
};
