import { SaleRepository } from "@/repositories/sale.repo";
import { InventoryRepository } from "@/repositories/inventory.repo";
import { ServiceRepository } from "@/repositories/service.repo";
import { AppointmentRepository } from "@/repositories/appointment.repo";
import { CashFlowRepository } from "@/repositories/cashflow.repo";
import { AppError } from "@/lib/api-handler";
import mongoose from "mongoose";

export const SaleService = {
    getSales: () => SaleRepository.find({}),

    getSaleById: async (id: string) => {
        const sale = await SaleRepository.findById(id);
        if (!sale) throw new AppError("Venta no encontrada", 404);
        return sale;
    },

    createSale: async (data: {
        products?: any[],
        services?: any[],
        paymentMethod: "Efectivo" | "Tarjeta" | "Transferencia" | "Otro",
        client?: string,
        pet?: string,
        appointment?: string,
        userId: string
    }) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            let subtotal = 0;
            const saleProducts: any[] = [];
            const saleServices: any[] = [];

            // 1. Process Products
            if (data.products) {
                for (const item of data.products) {
                    const product = await InventoryRepository.findProductById(item.product);
                    if (!product) throw new Error(`Producto ${item.product} no encontrado`);
                    if (product.quantity < item.quantity) throw new Error(`Stock insuficiente para ${product.name}`);

                    // Deduct stock
                    await InventoryRepository.updateProduct(item.product, { $inc: { quantity: -item.quantity } });

                    // Movement
                    await InventoryRepository.createMovement({
                        product: product._id as any,
                        type: "SALIDA",
                        quantity: item.quantity,
                        reason: "Venta directa",
                        user: data.userId as any,
                        date: new Date()
                    });

                    const price = item.price !== undefined ? item.price : product.salePrice;
                    saleProducts.push({ product: product._id, name: product.name, quantity: item.quantity, price });
                    subtotal += price * item.quantity;
                }
            }

            // 2. Process Services
            if (data.services) {
                for (const item of data.services) {
                    const service = await ServiceRepository.findById(item.service);
                    if (!service) throw new Error(`Servicio ${item.service} no encontrado`);
                    if (!service.isActive) throw new Error(`El servicio ${service.name} no está activo`);

                    const price = item.price !== undefined ? item.price : service.basePrice;
                    saleServices.push({ service: service._id, name: service.name, quantity: item.quantity, price });
                    subtotal += price * item.quantity;
                }
            }

            const iva = subtotal * 0.15;
            const total = subtotal + iva;

            // 3. Mark Appointment as completed
            if (data.appointment) {
                await AppointmentRepository.updateById(data.appointment, { status: "completado" });
            }

            // 4. Create Sale
            const sale = await SaleRepository.create({
                products: saleProducts,
                services: saleServices,
                subtotal,
                iva,
                total,
                paymentMethod: data.paymentMethod,
                client: data.client as any,
                pet: data.pet as any,
                appointment: data.appointment as any,
                user: data.userId as any,
                date: new Date()
            }, session);

            // 5. Create CashFlow
            const itemsDesc = [];
            if (saleProducts.length > 0) itemsDesc.push(`${saleProducts.length} prod.`);
            if (saleServices.length > 0) itemsDesc.push(`${saleServices.length} serv.`);

            await CashFlowRepository.create({
                date: new Date(),
                type: 'INGRESO',
                category: 'VENTA',
                description: `Venta #${(sale as any)._id.toString().slice(-8)} - ${data.paymentMethod} - ${itemsDesc.join(' + ')}`,
                amount: total,
                relatedDocument: (sale as any)._id.toString(),
                createdBy: data.userId || 'Sistema'
            });

            await session.commitTransaction();
            return sale;
        } catch (error: any) {
            await session.abortTransaction();
            throw new AppError(error.message || "Error al registrar la venta", 400);
        } finally {
            session.endSession();
        }
    },
};
