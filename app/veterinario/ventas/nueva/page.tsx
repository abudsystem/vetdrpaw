"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface IProduct {
    _id: string;
    name: string;
    salePrice: number;
    quantity: number; // Stock
}

interface IService {
    _id: string;
    name: string;
    basePrice: number;
    isActive: boolean;
}

interface ICartItem {
    id: string; // product or service ID
    name: string;
    type: 'product' | 'service';
    quantity: number;
    price: number;
    stockAvailable?: number; // Only for products
}

interface IUser {
    _id: string;
    name: string;
    email: string;
}

export default function NewSalePage() {
    const router = useRouter();
    const [products, setProducts] = useState<IProduct[]>([]);
    const [services, setServices] = useState<IService[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
    const [filteredServices, setFilteredServices] = useState<IService[]>([]);
    const [clients, setClients] = useState<IUser[]>([]);
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState<'products' | 'services'>('products');

    const [cart, setCart] = useState<ICartItem[]>([]);
    const [selectedClient, setSelectedClient] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Efectivo");
    const [loading, setLoading] = useState(false);

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, servRes, userRes] = await Promise.all([
                    fetch("/api/inventory"),
                    fetch("/api/services?activeOnly=true"),
                    fetch("/api/users?role=cliente")
                ]);

                if (prodRes.ok) {
                    const prodData = await prodRes.json();
                    setProducts(prodData);
                    setFilteredProducts(prodData);
                }
                if (servRes.ok) {
                    const servData = await servRes.json();
                    setServices(servData);
                    setFilteredServices(servData);
                }
                if (userRes.ok) {
                    const userData = await userRes.json();
                    setClients(userData);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    // Filter products and services
    useEffect(() => {
        if (!search) {
            setFilteredProducts(products);
            setFilteredServices(services);
        } else {
            const lower = search.toLowerCase();
            setFilteredProducts(products.filter(p => p.name.toLowerCase().includes(lower)));
            setFilteredServices(services.filter(s => s.name.toLowerCase().includes(lower)));
        }
    }, [search, products, services]);

    const addProductToCart = (product: IProduct) => {
        if (product.quantity <= 0) {
            alert("Producto sin stock");
            return;
        }

        setCart(prev => {
            const existing = prev.find(item => item.id === product._id && item.type === 'product');
            if (existing) {
                if (existing.quantity + 1 > product.quantity) {
                    alert("No hay suficiente stock");
                    return prev;
                }
                return prev.map(item =>
                    item.id === product._id && item.type === 'product'
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, {
                id: product._id,
                name: product.name,
                type: 'product',
                quantity: 1,
                price: product.salePrice,
                stockAvailable: product.quantity
            }];
        });
    };

    const addServiceToCart = (service: IService) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === service._id && item.type === 'service');
            if (existing) {
                return prev.map(item =>
                    item.id === service._id && item.type === 'service'
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, {
                id: service._id,
                name: service.name,
                type: 'service',
                quantity: 1,
                price: service.basePrice
            }];
        });
    };

    const removeFromCart = (id: string, type: 'product' | 'service') => {
        setCart(prev => prev.filter(item => !(item.id === id && item.type === type)));
    };

    const updateQuantity = (id: string, type: 'product' | 'service', newQty: number) => {
        if (newQty < 1) return;
        const item = cart.find(i => i.id === id && i.type === type);
        if (!item) return;

        // Check stock for products
        if (type === 'product' && item.stockAvailable && newQty > item.stockAvailable) {
            alert("Stock insuficiente");
            return;
        }

        setCart(prev => prev.map(i =>
            i.id === id && i.type === type ? { ...i, quantity: newQty } : i
        ));
    };

    const calculateTotal = () => {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const handleCompleteSale = async () => {
        if (cart.length === 0) return;
        if (!confirm("¿Confirmar venta?")) return;

        setLoading(true);
        try {
            const meRes = await fetch("/api/users/me");
            if (!meRes.ok) throw new Error("No autenticado");
            const me = await meRes.json();

            // Separate products and services
            const productItems = cart.filter(item => item.type === 'product');
            const serviceItems = cart.filter(item => item.type === 'service');

            const payload = {
                products: productItems.map(item => ({
                    product: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                services: serviceItems.map(item => ({
                    service: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                paymentMethod,
                client: selectedClient || null,
                userId: me._id
            };

            const res = await fetch("/api/sales", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("Venta registrada correctamente");
                router.push("/veterinario/ventas");
            } else {
                const err = await res.json();
                alert(`Error: ${err.message}`);
            }
        } catch (error) {
            console.error("Error completing sale:", error);
            alert("Error al procesar  la venta");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-100px)]">
            {/* Left: Catalog */}
            <div className="w-full md:w-2/3 bg-white p-6 rounded-lg shadow-md flex flex-col">
                <div className="flex gap-4 mb-4 border-b">
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`pb-2 px-4 font-semibold transition-colors ${activeTab === 'products'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        🛒 Productos ({filteredProducts.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('services')}
                        className={`pb-2 px-4 font-semibold transition-colors ${activeTab === 'services'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        🩺 Servicios ({filteredServices.length})
                    </button>
                </div>

                <input
                    type="text"
                    placeholder={`Buscar ${activeTab === 'products' ? 'producto' : 'servicio'}...`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 mb-4 text-black"
                />

                <div className="flex-1 overflow-y-auto gap-4 content-start">
                    {activeTab === 'products' ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {filteredProducts.map(product => (
                                <div
                                    key={product._id}
                                    onClick={() => addProductToCart(product)}
                                    className={`border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow ${product.quantity === 0 ? 'opacity-50 bg-gray-100 cursor-not-allowed' : 'bg-white'
                                        }`}
                                >
                                    <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
                                    <p className="text-gray-600 text-sm">Stock: {product.quantity}</p>
                                    <p className="text-blue-600 font-bold mt-2">${product.salePrice.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {filteredServices.map(service => (
                                <div
                                    key={service._id}
                                    onClick={() => addServiceToCart(service)}
                                    className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow bg-white"
                                >
                                    <h3 className="font-semibold text-gray-800 truncate">{service.name}</h3>
                                    <p className="text-green-600 text-xs mt-1">✓ Disponible</p>
                                    <p className="text-blue-600 font-bold mt-2">${service.basePrice.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Cart & Checkout */}
            <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-md flex flex-col">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Nueva Venta</h2>

                {/* Client Select */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cliente (Opcional)</label>
                    <select
                        value={selectedClient}
                        onChange={(e) => setSelectedClient(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 text-black"
                    >
                        <option value="">Público General</option>
                        {clients.map(c => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto mb-4 border-t border-b border-gray-200 py-2">
                    {cart.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">Carrito vacío</p>
                    ) : (
                        cart.map((item, index) => (
                            <div key={`${item.id}-${item.type}-${index}`} className="flex justify-between items-center py-2 border-b last:border-0">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800 text-sm">
                                        {item.name}
                                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${item.type === 'product'
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-green-100 text-green-700'
                                            }`}>
                                            {item.type === 'product' ? '🛒' : '🩺'}
                                        </span>
                                    </p>
                                    <p className="text-xs text-gray-500">${item.price.toFixed(2)} x {item.quantity}</p>
                                    <p className="text-xs font-semibold text-gray-700">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                                        className="bg-gray-200 px-2 rounded text-gray-700 hover:bg-gray-300"
                                    >-</button>
                                    <span className="text-sm font-bold text-gray-800">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                                        className="bg-gray-200 px-2 rounded text-gray-700 hover:bg-gray-300"
                                    >+</button>
                                    <button
                                        onClick={() => removeFromCart(item.id, item.type)}
                                        className="text-red-500 ml-2 hover:text-red-700"
                                    >&times;</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Totals & Payment */}
                <div className="space-y-4">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                        <span>Total:</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pago</label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 text-black"
                        >
                            <option value="Efectivo">Efectivo</option>
                            <option value="Tarjeta">Tarjeta</option>
                            <option value="Transferencia">Transferencia</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>

                    <button
                        onClick={handleCompleteSale}
                        disabled={cart.length === 0 || loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Procesando..." : "Completar Venta"}
                    </button>
                </div>
            </div>
        </div>
    );
}
