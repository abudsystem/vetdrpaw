"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface IProduct {
    _id: string;
    name: string;
    quantity: number;
}

interface IServiceSupply {
    product: string; // Product ID
    quantity: number;
    productName?: string; // For display
}

interface IServiceFormProps {
    initialData?: {
        name: string;
        description: string;
        basePrice: number;
        operatingCost: number;
        duration: number;
        supplies: IServiceSupply[];
    };
    onSubmit: (data: any) => Promise<void>;
    isEditing?: boolean;
}

export default function ServiceForm({ initialData, onSubmit, isEditing = false }: IServiceFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        basePrice: 0,
        operatingCost: 0,
        duration: 30,
        supplies: [] as IServiceSupply[],
    });

    const [products, setProducts] = useState<IProduct[]>([]);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [supplyQuantity, setSupplyQuantity] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            // Map initial supplies to include product names if possible, 
            // but we might need to fetch products first or rely on populated data passed in.
            // For now, assume initialData.supplies has what we need or we match it with fetched products.
            setFormData(initialData);
        }
        fetchProducts();
    }, [initialData]);

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/inventory");
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "basePrice" || name === "operatingCost" || name === "duration" ? parseFloat(value) : value,
        }));
    };

    const handleAddSupply = () => {
        if (!selectedProduct || supplyQuantity <= 0) return;

        const product = products.find((p) => p._id === selectedProduct);
        if (!product) return;

        // Check if already added
        if (formData.supplies.some((s) => s.product === selectedProduct)) {
            alert("Este insumo ya ha sido agregado.");
            return;
        }

        setFormData((prev) => ({
            ...prev,
            supplies: [
                ...prev.supplies,
                {
                    product: selectedProduct,
                    quantity: supplyQuantity,
                    productName: product.name,
                },
            ],
        }));

        setSelectedProduct("");
        setSupplyQuantity(1);
    };

    const handleRemoveSupply = (productId: string) => {
        setFormData((prev) => ({
            ...prev,
            supplies: prev.supplies.filter((s) => s.product !== productId),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await onSubmit(formData);
        setLoading(false);
    };

    // Helper to get product name if not in supply object (e.g. when editing and data came from DB populated)
    const getProductName = (supply: IServiceSupply) => {
        if (supply.productName) return supply.productName;
        // If initialData came with populated products, it might be an object, but our interface says string ID.
        // We need to handle the case where initialData.supplies has populated product objects.
        // However, to keep it simple, let's assume the parent component formats it correctly 
        // OR we look it up in the `products` list.
        const p = products.find(prod => prod._id === supply.product);
        return p ? p.name : "Producto desconocido";
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre del Servicio</label>
                    <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Duración Aproximada (minutos)</label>
                    <input
                        type="number"
                        name="duration"
                        required
                        min="1"
                        value={formData.duration}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Descripción</label>
                    <textarea
                        name="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Precio Base ($)</label>
                    <input
                        type="number"
                        name="basePrice"
                        required
                        min="0"
                        step="0.01"
                        value={formData.basePrice}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Costo Operativo ($)</label>
                    <input
                        type="number"
                        name="operatingCost"
                        min="0"
                        step="0.01"
                        value={formData.operatingCost}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    />
                </div>
            </div>

            <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Insumos Requeridos</h3>
                <div className="flex flex-col md:flex-row gap-4 items-end mb-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Producto</label>
                        <select
                            value={selectedProduct}
                            onChange={(e) => setSelectedProduct(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        >
                            <option value="">Seleccionar producto...</option>
                            {products.map((p) => (
                                <option key={p._id} value={p._id}>
                                    {p.name} (Stock: {p.quantity})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="w-32">
                        <label className="block text-sm font-medium text-gray-700">Cantidad</label>
                        <input
                            type="number"
                            min="1"
                            value={supplyQuantity}
                            onChange={(e) => setSupplyQuantity(parseInt(e.target.value))}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleAddSupply}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                        Agregar
                    </button>
                </div>

                {formData.supplies.length > 0 && (
                    <div className="bg-gray-50 rounded-md p-4">
                        <ul className="divide-y divide-gray-200">
                            {formData.supplies.map((supply, index) => (
                                <li key={index} className="py-2 flex justify-between items-center">
                                    <span className="text-gray-800">
                                        {getProductName(supply)} - {supply.quantity} unidades
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSupply(supply.product)}
                                        className="text-red-600 hover:text-red-800 text-sm"
                                    >
                                        Eliminar
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    {loading ? "Guardando..." : isEditing ? "Actualizar Servicio" : "Crear Servicio"}
                </button>
            </div>
        </form>
    );
}
