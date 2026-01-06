import { NextResponse } from "next/server";
import { Sale } from "../models/Sale";
import { Product } from "../models/Product";
import { InventoryMovement } from "../models/InventoryMovement";
import mongoose from "mongoose";

// Create Sale (with Products AND Services support)
export const createSale = async (req: Request) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const body = await req.json();
        const { products = [], services = [], paymentMethod, client, pet, appointment, userId } = body;

        let subtotal = 0;
        const saleProducts = [];
        const saleServices = [];

        // Process Products
        for (const item of products) {
            const product = await Product.findById(item.product).session(session);
            if (!product) {
                throw new Error(`Producto con ID ${item.product} no encontrado`);
            }

            if (product.quantity < item.quantity) {
                throw new Error(`Stock insuficiente para ${product.name}. Disponible: ${product.quantity}`);
            }

            // Deduct stock
            product.quantity -= item.quantity;
            await product.save({ session });

            // Create inventory movement
            await InventoryMovement.create([{
                product: product._id,
                type: "SALIDA",
                quantity: item.quantity,
                reason: "Venta directa",
                user: userId,
                date: new Date()
            }], { session });

            // Add to sale array with snapshot data
            const priceToUse = item.price !== undefined ? item.price : product.salePrice;
            saleProducts.push({
                product: product._id,
                name: product.name,
                quantity: item.quantity,
                price: priceToUse
            });

            subtotal += priceToUse * item.quantity;
        }

        // Process Services
        const { Service } = await import("../models/Service");
        for (const item of services) {
            const service = await Service.findById(item.service).session(session);
            if (!service) {
                throw new Error(`Servicio con ID ${item.service} no encontrado`);
            }

            if (!service.isActive) {
                throw new Error(`El servicio ${service.name} no está activo`);
            }

            // Add to sale array with snapshot data
            const priceToUse = item.price !== undefined ? item.price : service.basePrice;
            saleServices.push({
                service: service._id,
                name: service.name,
                quantity: item.quantity,
                price: priceToUse
            });

            subtotal += priceToUse * item.quantity;
        }

        // Calculate IVA (Ecuador 15%)
        const iva = subtotal * 0.15;
        const total = subtotal + iva;

        // If an appointment is provided, mark it as completed
        if (appointment) {
            const { Appointment } = await import("../models/Appointment");
            await Appointment.findByIdAndUpdate(appointment, { status: "completado" }).session(session);
        }

        // Create the sale
        const newSale = new Sale({
            products: saleProducts,
            services: saleServices,
            subtotal,
            iva,
            total,
            paymentMethod,
            client: client || null,
            pet: pet || null,
            appointment: appointment || null,
            user: userId,
            date: new Date()
        });

        await newSale.save({ session });

        // ✨ AUTO-INTEGRATION: Create cash flow entry for this sale
        const { CashFlow } = await import("../models/CashFlow");

        // Create description showing products and services
        const itemsDescription = [];
        if (saleProducts.length > 0) itemsDescription.push(`${saleProducts.length} producto(s)`);
        if (saleServices.length > 0) itemsDescription.push(`${saleServices.length} servicio(s)`);

        await CashFlow.create([{
            date: new Date(),
            type: 'INGRESO',
            category: 'VENTA',
            description: `Venta #${(newSale as any)._id.toString().slice(-8)} - ${paymentMethod} - ${itemsDescription.join(' + ')}`,
            amount: total,
            relatedDocument: (newSale as any)._id.toString(),
            createdBy: userId || 'Sistema'
        }], { session });

        await session.commitTransaction();
        session.endSession();

        return NextResponse.json(newSale, { status: 201 });
    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        return NextResponse.json({ message: error.message || "Error al registrar la venta" }, { status: 400 });
    }
};

// Get all sales
export const getSales = async (req: Request) => {
    try {
        const sales = await Sale.find()
            .populate("client", "name email")
            .populate("pet", "nombre especie")
            .populate("appointment", "reason date")
            .populate("user", "name")
            .populate("products.product", "name")
            .populate("services.service", "name")
            .sort({ createdAt: -1 });
        return NextResponse.json(sales, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error al obtener ventas", error }, { status: 500 });
    }
};

// Get sale by ID
export const getSaleById = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await params;
        const sale = await Sale.findById(id)
            .populate("client", "name email")
            .populate("pet", "nombre especie")
            .populate("appointment", "reason date")
            .populate("user", "name")
            .populate("products.product", "name")
            .populate("services.service", "name");

        if (!sale) {
            return NextResponse.json({ message: "Venta no encontrada" }, { status: 404 });
        }

        return NextResponse.json(sale, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error al obtener la venta", error }, { status: 500 });
    }
};
