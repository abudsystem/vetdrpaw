import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { Service } from "@/models/Service";
import { Product } from "@/models/Product";
import { InventoryMovement } from "@/models/InventoryMovement";
import connectDB from "@/lib/db";

/** ================================
 *   GET ALL SERVICES
 * ================================ */
export const getServices = async (req: NextRequest) => {
    await connectDB();

    try {
        const activeOnly = req.nextUrl.searchParams.get("activeOnly");
        const filter = activeOnly === "true" ? { isActive: true } : {};

        const services = await Service.find(filter).populate("supplies.product");
        return NextResponse.json(services, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { message: "Error al obtener servicios", error: error.message },
            { status: 500 }
        );
    }
};

/** ================================
 *   GET SERVICE BY ID
 * ================================ */
export const getServiceById = async (id: string) => {
    await connectDB();

    try {
        const service = await Service.findById(id).populate("supplies.product");

        if (!service) {
            return NextResponse.json(
                { message: "Servicio no encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json(service, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { message: "Error al obtener el servicio", error: error.message },
            { status: 500 }
        );
    }
};

/** ================================
 *   CREATE SERVICE
 * ================================ */
export const createService = async (req: NextRequest) => {
    await connectDB();

    try {
        const body = await req.json();
        const { name, description, basePrice, operatingCost, supplies, duration } = body;

        const newService = new Service({
            name,
            description,
            basePrice,
            operatingCost,
            supplies,
            duration,
        });

        await newService.save();

        return NextResponse.json(newService, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { message: "Error al crear el servicio", error: error.message },
            { status: 500 }
        );
    }
};

/** ================================
 *   UPDATE SERVICE
 * ================================ */
export const updateService = async (id: string, req: NextRequest) => {
    await connectDB();

    try {
        const body = await req.json();

        const updatedService = await Service.findByIdAndUpdate(id, body, {
            new: true,
        });

        if (!updatedService) {
            return NextResponse.json(
                { message: "Servicio no encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedService, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { message: "Error al actualizar el servicio", error: error.message },
            { status: 500 }
        );
    }
};

/** ================================
 *   TOGGLE SERVICE STATUS
 * ================================ */
export const toggleServiceStatus = async (id: string) => {
    await connectDB();

    try {
        const service = await Service.findById(id);

        if (!service) {
            return NextResponse.json(
                { message: "Servicio no encontrado" },
                { status: 404 }
            );
        }

        service.isActive = !service.isActive;
        await service.save();

        return NextResponse.json(
            {
                message: `Servicio ${service.isActive ? "activado" : "desactivado"} correctamente`,
                service,
            },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: "Error al cambiar estado del servicio", error: error.message },
            { status: 500 }
        );
    }
};

/** ================================
 *   DEDUCT SERVICE SUPPLIES
 * ================================ */
export const deductServiceSupplies = async (id: string, req: NextRequest) => {
    await connectDB();

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const body = await req.json();
        const { userId } = body;

        const service = await Service.findById(id);
        if (!service) {
            throw new Error("Servicio no encontrado");
        }

        for (const supply of service.supplies) {
            const product = await Product.findById(supply.product).session(session);
            if (!product) throw new Error(`Producto con ID ${supply.product} no encontrado`);

            if (product.quantity < supply.quantity) {
                throw new Error(`Stock insuficiente para ${product.name}`);
            }

            // Restar stock
            product.quantity -= supply.quantity;
            await product.save({ session });

            // Registrar movimiento
            await InventoryMovement.create(
                [
                    {
                        product: product._id,
                        type: "SALIDA",
                        quantity: supply.quantity,
                        reason: `Uso en servicio: ${service.name}`,
                        user: userId,
                        date: new Date(),
                    },
                ],
                { session }
            );
        }

        await session.commitTransaction();
        session.endSession();

        return NextResponse.json(
            { message: "Insumos descontados correctamente" },
            { status: 200 }
        );
    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();

        return NextResponse.json(
            { message: error.message ?? "Error al descontar insumos" },
            { status: 400 }
        );
    }
};
