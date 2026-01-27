"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Modal } from "@/components/ui/Modal";
import { CheckCircle, FileText, Plus, History, Eye } from "lucide-react";
import Link from "next/link";

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

interface IPet {
    _id: string;
    nombre: string;
    propietario: string;
}

interface IAppointment {
    _id: string;
    pet: any; // populated or ID
    createdBy: string;
    reason: string;
    status: string;
    date: string;
}

export default function NewSalePage() {
    const t = useTranslations('VetPanel.sales');
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
    const [selectedPet, setSelectedPet] = useState("");
    const [selectedAppointment, setSelectedAppointment] = useState("");
    const [pets, setPets] = useState<IPet[]>([]);
    const [appointments, setAppointments] = useState<IAppointment[]>([]);
    const [paymentMethod, setPaymentMethod] = useState("Efectivo");
    const [invoiceNumber, setInvoiceNumber] = useState(""); // NEW
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [createdSale, setCreatedSale] = useState<any>(null);

    const getId = useCallback((item: any) => {
        if (!item) return "";
        return typeof item === 'object' ? item._id : item;
    }, []);

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, servRes, userRes, petRes, appRes] = await Promise.all([
                    fetch("/api/inventory"),
                    fetch("/api/services?activeOnly=true"),
                    fetch("/api/users?role=cliente"),
                    fetch("/api/pets"),
                    fetch("/api/appointments")
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
                if (petRes.ok) {
                    const petData = await petRes.json();
                    setPets(petData);
                }
                if (appRes.ok) {
                    const appData = await appRes.json();
                    // Solo citas aceptadas o pendientes que no estén canceladas ni completadas
                    setAppointments(appData.filter((a: any) => a.status === 'aceptada' || a.status === 'pendiente'));
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    // Filter appointments and pets when client changes
    useEffect(() => {
        if (selectedAppointment) {
            const app = appointments.find(a => a._id === selectedAppointment);
            if (app) {
                const petId = getId(app.pet);
                setSelectedPet(petId);

                // Try to get owner from pet first, then from app.createdBy
                const ownerId = (app.pet && typeof app.pet === 'object')
                    ? getId(app.pet.propietario)
                    : getId(app.createdBy);

                setSelectedClient(ownerId);
            }
        }
    }, [selectedAppointment, appointments, getId]);

    useEffect(() => {
        if (!selectedClient) {
            setSelectedPet("");
            setSelectedAppointment("");
        }
    }, [selectedClient]);

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
            alert(t("alertProduct"));
            return;
        }

        setCart(prev => {
            const existing = prev.find(item => item.id === product._id && item.type === 'product');
            if (existing) {
                if (existing.quantity + 1 > product.quantity) {
                    alert(t("alertStock"));
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
            alert(t("alertStock"));
            return;
        }

        setCart(prev => prev.map(i =>
            i.id === id && i.type === type ? { ...i, quantity: newQty } : i
        ));
    };

    const calculateSubtotal = () => {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const calculateIVA = () => {
        return calculateSubtotal() * 0.15;
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateIVA();
    };

    const handleCompleteSale = async () => {
        if (cart.length === 0) return;
        if (!confirm(t("confirmSale"))) return;

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
                pet: selectedPet || null,
                appointment: selectedAppointment || null,
                invoiceNumber: invoiceNumber || undefined, // NEW
                userId: me._id
            };

            const res = await fetch("/api/sales", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const saleData = await res.json();
                setCreatedSale(saleData);
                setShowSuccessModal(true);
                // Reset form
                setCart([]);
                setSelectedClient("");
                setSelectedPet("");
                setSelectedAppointment("");
                setInvoiceNumber("");
            } else {
                const err = await res.json();
                if (err.error === "VALIDATION_ERROR" && err.fields) {
                    const details = err.fields.map((f: any) => `${f.field}: ${f.message}`).join("\n");
                    alert(`Error de validación:\n${details}`);
                } else {
                    alert(`Error: ${err.message || "Error desconocido"}`);
                }
            }
        } catch (error) {
            console.error(t("saleError"), error);
            alert(t("saleError"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 md:h-[calc(100vh-140px)] pb-10">
            {/* Left: Catalog */}
            <div className="w-full md:w-2/3 bg-white p-6 rounded-lg shadow-md flex flex-col min-h-[500px] md:min-h-0 md:h-full">
                <div className="flex gap-4 mb-4 border-b">
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`pb-2 px-4 font-semibold transition-colors ${activeTab === 'products'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-700 hover:text-gray-700'
                            }`}
                    >
                        🛒 {t("products")} ({filteredProducts.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('services')}
                        className={`pb-2 px-4 font-semibold transition-colors ${activeTab === 'services'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-700 hover:text-gray-700'
                            }`}
                    >
                        🩺 {t("services")} ({filteredServices.length})
                    </button>
                </div>

                <input
                    type="text"
                    placeholder={`${t("searchPlaceholderSales")} ${activeTab === 'products' ? t("searchPlaceholderProducts") : t("searchPlaceholderServices")}`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 mb-4 text-black"
                />

                <div className="md:flex-1 md:overflow-y-auto min-h-[300px] p-1">
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
                                    <p className="text-gray-600 text-sm">{t("stock")}: {product.quantity}</p>
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
                                    <p className="text-green-600 text-xs mt-1">✓ {t("available")}</p>
                                    <p className="text-blue-600 font-bold mt-2">${service.basePrice.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Cart & Checkout */}
            <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-md flex flex-col min-h-[400px] md:min-h-0 md:h-full">
                <h2 className="text-xl font-bold mb-4 text-gray-800">{t("newSale")}</h2>

                {/* Client Select */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t("clientSelect")}</label>
                    <select
                        value={selectedClient}
                        onChange={(e) => setSelectedClient(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 text-black"
                    >
                        <option value="">{t("publicGeneral")}</option>
                        {clients.map(c => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                {/* Pet Select */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t("petSelect")}</label>
                    <select
                        value={selectedPet}
                        onChange={(e) => setSelectedPet(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 text-black"
                    >
                        <option value=""> -- {t("selectPet")} --</option>
                        {pets
                            .filter(p => !selectedClient || getId(p.propietario) === selectedClient)
                            .map(p => (
                                <option key={p._id} value={p._id}>{p.nombre}</option>
                            ))
                        }
                    </select>
                </div>

                {/* Appointment Select */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t("appointmentSelect")}</label>
                    <select
                        value={selectedAppointment}
                        onChange={(e) => setSelectedAppointment(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 text-black"
                    >
                        <option value="">-- {t("selectAppointment")} --</option>
                        {appointments
                            .filter(a => {
                                if (selectedPet) {
                                    return getId(a.pet) === selectedPet;
                                }
                                if (selectedClient) return getId(a.createdBy) === selectedClient || (a.pet && getId(a.pet.propietario) === selectedClient);
                                return true;
                            })
                            .map(a => (
                                <option key={a._id} value={a._id}>
                                    {new Date(a.date).toLocaleDateString()} - {a.reason}
                                </option>
                            ))
                        }
                    </select>
                </div>

                {/* Cart Items */}
                <div className="md:flex-1 md:overflow-y-auto min-h-[200px] mb-4 border-t border-b border-gray-200 py-2">
                    {cart.length === 0 ? (
                        <p className="text-gray-700 text-center py-4">{t("carEmpty")}</p>
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
                                    <p className="text-xs text-gray-700">${item.price.toFixed(2)} x {item.quantity}</p>
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

                <div className="space-y-4">
                    <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>{t("subtotal")}:</span>
                            <span>${calculateSubtotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>IVA (15%):</span>
                            <span>${calculateIVA().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-2">
                            <span>{t("total")}:</span>
                            <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Invoice Number Input - NEW */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("invoiceNumber") || "Número de Factura / Nota"} <span className="text-gray-400 font-normal">({t("optional") || "Opcional"})</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Ej: A-0001"
                            value={invoiceNumber}
                            onChange={(e) => setInvoiceNumber(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 text-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t("bill.paymentMethod")}</label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 text-black"
                        >
                            <option value="Efectivo">{t("cash")}</option>
                            <option value="Tarjeta">{t("card")}</option>
                            <option value="Transferencia">{t("transfer")}</option>
                            <option value="Otro">{t("other")}</option>
                        </select>
                    </div>

                    <button
                        onClick={handleCompleteSale}
                        disabled={cart.length === 0 || loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                    >
                        {loading ? t("processing") : t("confirmSales")}
                    </button>
                </div>
            </div>

            {/* Success Modal */}
            <Modal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title={t("successModalTitle")}
                size="md"
            >
                <div className="flex flex-col items-center text-center p-2">
                    <div className="bg-green-100 p-4 rounded-full mb-4">
                        <CheckCircle className="text-green-600 w-12 h-12" />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        {t("saleSuccess")}
                    </h3>

                    <div className="w-full bg-gray-50 rounded-lg p-4 mb-6 text-left border border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-500 text-sm font-medium">{t("invoiceInternal")}</span>
                            <span className="text-gray-900 font-bold">#{(createdSale as any)?._id?.slice(-8).toUpperCase()}</span>
                        </div>
                        {createdSale?.invoiceNumber && (
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-500 text-sm font-medium">{t("invoiceManual")}</span>
                                <span className="text-black font-bold">{createdSale.invoiceNumber}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center mb-2 border-t pt-2 mt-2">
                            <span className="text-gray-500 text-sm font-medium">{t("total")}</span>
                            <span className="text-black font-extrabold text-xl">${createdSale?.total?.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 w-full">
                        <Link
                            href={`/veterinario/ventas/detalle/${createdSale?._id}`}
                            className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                        >
                            <Eye size={20} /> {t("table.viewInvoice")}
                        </Link>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors border border-gray-200"
                            >
                                <Plus size={20} /> {t("nextSale")}
                            </button>

                            <Link
                                href="/veterinario/ventas"
                                className="flex items-center justify-center gap-2 bg-white text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors border border-gray-200"
                            >
                                <History size={20} /> {t("backToList")}
                            </Link>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
