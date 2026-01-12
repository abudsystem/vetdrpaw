import { AnalyticsService } from "@/services/analytics.service";
import { apiHandler } from "@/lib/api-handler";
import { NextResponse } from "next/server";

export const AnalyticsController = {
    getDashboardData: apiHandler(async () => {
        const data = await AnalyticsService.getDashboardData();
        return NextResponse.json(data);
    }, { requiredRoles: ['administrador'] }),

    getFinancialStats: apiHandler(async () => {
        const data = await AnalyticsService.getFinancialStats();
        return NextResponse.json(data);
    }, { requiredRoles: ['administrador'] }),

    getClientStats: apiHandler(async () => {
        const data = await AnalyticsService.getClientStats();
        return NextResponse.json(data);
    }, { requiredRoles: ['administrador'] }),

    getSalesStats: apiHandler(async () => {
        const data = await AnalyticsService.getSalesStats();
        return NextResponse.json(data);
    }, { requiredRoles: ['administrador'] }),

    getOperationStats: apiHandler(async () => {
        const data = await AnalyticsService.getOperationStats();
        return NextResponse.json(data);
    }, { requiredRoles: ['administrador'] }),
};
