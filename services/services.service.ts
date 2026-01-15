import { ServiceRepository } from "@/repositories/service.repo";
import { InventoryRepository } from "@/repositories/inventory.repo";
import { IService } from "@/models/Service";
import { UpdateQuery } from "mongoose";
import { AppError } from "@/lib/api-handler";
import mongoose from "mongoose";
/**
export const ServicesService = {
    getServices: (activeOnly: boolean = false) => {
        const query = activeOnly ? { isActive: true } : {};
        return ServiceRepository.find(query);
    },

    getServiceById: async (id: string) => {
        const service = await ServiceRepository.findById(id);
        if (!service) throw new AppError("Servicio no encontrado", 404);
        return service;
    },

    createService: (data: Partial<IService>) => ServiceRepository.create(data),

    updateService: async (id: string, data: UpdateQuery<IService>) => {
        const updated = await ServiceRepository.update(id, data);
        if (!updated) throw new AppError("Servicio no encontrado", 404);
        return updated;
    },

    toggleServiceStatus: async (id: string) => {
        const service = await ServiceRepository.findById(id);
        if (!service) throw new AppError("Servicio no encontrado", 404);
        return ServiceRepository.update(id, { isActive: !service.isActive });
    },

    deductSupplies: async (id: string, userId: string) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const service = await ServiceRepository.findById(id);
            if (!service) throw new Error("Servicio no encontrado");

            for (const supply of service.supplies) {
                const product = await InventoryRepository.findProductById(supply.product.toString());
                if (!product) throw new Error(`Producto ${supply.product} no encontrado`);
                if (product.quantity < supply.quantity) throw new Error(`Stock insuficiente para ${product.name}`);

                await InventoryRepository.updateProduct(supply.product.toString(), { $inc: { quantity: -supply.quantity } });

                await InventoryRepository.createMovement({
                    product: product._id as any,
                    type: "SALIDA",
                    quantity: supply.quantity,
                    reason: `Uso en servicio: ${service.name}`,
                    user: userId as any,
                    date: new Date(),
                });
            }
            await session.commitTransaction();
            return { message: "Insumos descontados correctamente" };
        } catch (error: any) {
            await session.abortTransaction();
            throw new AppError(error.message || "Error al descontar insumos", 400);
        } finally {
            session.endSession();
        }
    },
    toggleServiceStatus: async (id: string) => {
        const updated = await ServiceRepository.toggleActive(id);

        if (!updated) {
            throw new AppError("Servicio no encontrado", 404);
        }

        return updated;
    },
};
 */
export const ServicesService = {
    getServices: (activeOnly: boolean = false) => {
        const query = activeOnly ? { isActive: true } : {};
        return ServiceRepository.find(query);
    },

    getServiceById: async (id: string) => {
        const service = await ServiceRepository.findById(id);
        if (!service) throw new AppError("Servicio no encontrado", 404);
        return service;
    },

    createService: (data: Partial<IService>) =>
        ServiceRepository.create(data),

    updateService: async (id: string, data: UpdateQuery<IService>) => {
        const updated = await ServiceRepository.update(id, data);
        if (!updated) throw new AppError("Servicio no encontrado", 404);
        return updated;
    },

    /** ✅ ÚNICO toggle */
    toggleServiceStatus: async (id: string) => {
        const updated = await ServiceRepository.toggleActive(id);
        if (!updated) throw new AppError("Servicio no encontrado", 404);
        return updated;
    },

    deductSupplies: async (id: string, userId: string) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const service = await ServiceRepository.findById(id);
            if (!service) throw new Error("Servicio no encontrado");

            for (const supply of service.supplies) {
                const product = await InventoryRepository.findProductById(
                    supply.product.toString()
                );

                if (!product)
                    throw new Error(`Producto ${supply.product} no encontrado`);

                if (product.quantity < supply.quantity)
                    throw new Error(`Stock insuficiente para ${product.name}`);

                await InventoryRepository.updateProduct(
                    supply.product.toString(),
                    { $inc: { quantity: -supply.quantity } }
                );

                await InventoryRepository.createMovement({
                    product: product._id as any,
                    type: "SALIDA",
                    quantity: supply.quantity,
                    reason: `Uso en servicio: ${service.name}`,
                    user: userId as any,
                    date: new Date(),
                });
            }

            await session.commitTransaction();
            return { message: "Insumos descontados correctamente" };
        } catch (error: any) {
            await session.abortTransaction();
            throw new AppError(
                error.message || "Error al descontar insumos",
                400
            );
        } finally {
            session.endSession();
        }
    },
};
