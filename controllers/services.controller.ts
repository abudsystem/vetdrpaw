import { Request, Response } from "express";
import { Service } from "../models/Service";
import { Product } from "../models/Product";
import { InventoryMovement } from "../models/InventoryMovement";
import mongoose from "mongoose";

// Get all services
export const getServices = async (req: Request, res: Response) => {
    try {
        const { activeOnly } = req.query;
        const filter = activeOnly === "true" ? { isActive: true } : {};
        const services = await Service.find(filter).populate("supplies.product");
        return res.status(200).json(services);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener servicios", error });
    }
};

// Get single service
export const getServiceById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const service = await Service.findById(id).populate("supplies.product");
        if (!service) {
            return res.status(404).json({ message: "Servicio no encontrado" });
        }
        return res.status(200).json(service);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener el servicio", error });
    }
};

// Create service
export const createService = async (req: Request, res: Response) => {
    try {
        const { name, description, basePrice, operatingCost, supplies, duration } = req.body;

        const newService = new Service({
            name,
            description,
            basePrice,
            operatingCost,
            supplies,
            duration,
        });

        await newService.save();
        return res.status(201).json(newService);
    } catch (error) {
        return res.status(500).json({ message: "Error al crear el servicio", error });
    }
};

// Update service
export const updateService = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedService = await Service.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedService) {
            return res.status(404).json({ message: "Servicio no encontrado" });
        }

        return res.status(200).json(updatedService);
    } catch (error) {
        return res.status(500).json({ message: "Error al actualizar el servicio", error });
    }
};

// Toggle service status (Soft delete)
export const toggleServiceStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const service = await Service.findById(id);

        if (!service) {
            return res.status(404).json({ message: "Servicio no encontrado" });
        }

        service.isActive = !service.isActive;
        await service.save();

        return res.status(200).json({ message: `Servicio ${service.isActive ? 'activado' : 'desactivado'} correctamente`, service });
    } catch (error) {
        return res.status(500).json({ message: "Error al cambiar estado del servicio", error });
    }
};

// Helper to deduct supplies (to be used when a service is performed)
// This is exposed as an API for testing purposes now, but logic belongs in Consultation/MedicalRecord creation
export const deductServiceSupplies = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { id } = req.params; // Service ID
        const { userId } = req.body; // User performing the action (for inventory movement)

        const service = await Service.findById(id);
        if (!service) {
            throw new Error("Servicio no encontrado");
        }

        for (const supply of service.supplies) {
            const product = await Product.findById(supply.product).session(session);
            if (!product) {
                throw new Error(`Producto con ID ${supply.product} no encontrado`);
            }

            if (product.quantity < supply.quantity) {
                throw new Error(`Stock insuficiente para ${product.name}`);
            }

            // Deduct stock
            product.quantity -= supply.quantity;
            await product.save({ session });

            // Create movement
            await InventoryMovement.create([{
                product: product._id,
                type: "SALIDA",
                quantity: supply.quantity,
                reason: `Uso en servicio: ${service.name}`,
                user: userId,
                date: new Date()
            }], { session });
        }

        await session.commitTransaction();
        session.endSession();
        return res.status(200).json({ message: "Insumos descontados correctamente" });
    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: error.message || "Error al descontar insumos" });
    }
};
