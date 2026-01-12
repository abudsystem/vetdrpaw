import { AssetRepository } from "@/repositories/asset.repo";
import { IAsset } from "@/models/Asset";
import { AppError } from "@/lib/api-handler";
import { UpdateQuery } from "mongoose";

const calculateCurrentValue = (asset: IAsset): number => {
    if (!asset.isDepreciable || !asset.usefulLifeMonths || asset.usefulLifeMonths <= 0) {
        return asset.initialValue;
    }
    const now = new Date();
    const acquisition = new Date(asset.acquisitionDate);
    const monthsElapsed = (now.getFullYear() - acquisition.getFullYear()) * 12 + (now.getMonth() - acquisition.getMonth());
    if (monthsElapsed <= 0) return asset.initialValue;
    const monthlyDepreciation = asset.initialValue / asset.usefulLifeMonths;
    const totalDepreciation = monthlyDepreciation * monthsElapsed;
    const currentValue = asset.initialValue - totalDepreciation;
    return Math.max(0, Number(currentValue.toFixed(2)));
};

export const AssetService = {
    list: async (filters: { search?: string | null, category?: string | null }) => {
        let query: any = {};
        if (filters.search) query.name = { $regex: filters.search, $options: "i" };
        if (filters.category) query.category = filters.category;

        const assets = await AssetRepository.find(query);
        return assets.map(asset => ({
            ...asset.toObject(),
            totalValue: calculateCurrentValue(asset)
        }));
    },

    create: (data: Partial<IAsset>) => {
        const initialValue = (data.quantity || 1) * (data.unitCost || 0);
        return AssetRepository.create({
            ...data,
            initialValue,
            totalValue: initialValue,
        });
    },

    getById: async (id: string) => {
        const asset = await AssetRepository.findById(id);
        if (!asset) throw new AppError("Activo no encontrado", 404);
        return {
            ...asset.toObject(),
            totalValue: calculateCurrentValue(asset)
        };
    },

    update: async (id: string, data: any) => {
        const currentAsset = await AssetRepository.findById(id);
        if (!currentAsset) throw new AppError("Activo no encontrado", 404);

        const newQuantity = data.quantity ?? currentAsset.quantity;
        const newUnitCost = data.unitCost ?? currentAsset.unitCost;
        const newInitialValue = newQuantity * newUnitCost;

        const updateData = {
            ...data,
            initialValue: newInitialValue,
        };

        const tempAsset = {
            ...currentAsset.toObject(),
            ...updateData,
            acquisitionDate: data.acquisitionDate ? new Date(data.acquisitionDate) : currentAsset.acquisitionDate
        } as unknown as IAsset;

        updateData.totalValue = calculateCurrentValue(tempAsset);
        return AssetRepository.update(id, updateData);
    },

    delete: async (id: string) => {
        const deleted = await AssetRepository.delete(id);
        if (!deleted) throw new AppError("Activo no encontrado", 404);
        return deleted;
    },

    getStats: async () => {
        const assets = await AssetRepository.find({});
        let totalValue = 0;
        let totalDepreciation = 0;
        assets.forEach(asset => {
            const currentVal = calculateCurrentValue(asset);
            totalValue += currentVal;
            totalDepreciation += (asset.initialValue - currentVal);
        });
        return { totalValue, totalDepreciation, count: assets.length };
    },
};
