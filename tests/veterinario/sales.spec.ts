import { test, expect } from "@playwright/test";
import { createTestUser, loginUser, getAuthHeaders } from "../helpers/auth";
import { generateProductData, generateSaleData } from "../helpers/test-data";

const BASE_URL = "http://localhost:3000/api";

test.describe("Veterinarian - Sales Management", () => {
    let vetToken: string;
    let adminToken: string;
    let productId: string;

    test.beforeEach(async ({ request }) => {
        // Crear veterinario
        const vetUser = await createTestUser(request, "veterinario");
        vetToken = await loginUser(request, vetUser.email, vetUser.password);

        // Crear admin para crear productos
        const adminUser = await createTestUser(request, "administrador");
        adminToken = await loginUser(request, adminUser.email, adminUser.password);

        // Crear un producto
        const productData = generateProductData();
        const productResponse = await request.post(`${BASE_URL}/inventory`, {
            headers: getAuthHeaders(adminToken),
            data: productData,
        });
        const product = await productResponse.json();
        productId = product._id;
    });

    test("Should create a new sale", async ({ request }) => {
        const saleData = generateSaleData(productId);

        const response = await request.post(`${BASE_URL}/sales`, {
            headers: getAuthHeaders(vetToken),
            data: saleData,
        });

        expect(response.status()).toBe(201);
        const sale = await response.json();
        // 100 + 15% IVA = 115
        expect(sale.total).toBe(115);
        expect(sale.paymentMethod).toBe(saleData.paymentMethod);
    });

    test("Should list all sales", async ({ request }) => {
        const response = await request.get(`${BASE_URL}/sales`, {
            headers: getAuthHeaders(vetToken),
        });

        expect(response.status()).toBe(200);
        const sales = await response.json();
        expect(Array.isArray(sales)).toBeTruthy();
    });

    test("Should get a single sale by ID", async ({ request }) => {
        const saleData = generateSaleData(productId);
        const createResponse = await request.post(`${BASE_URL}/sales`, {
            headers: getAuthHeaders(vetToken),
            data: saleData,
        });
        const createdSale = await createResponse.json();

        const response = await request.get(`${BASE_URL}/sales/${createdSale._id}`, {
            headers: getAuthHeaders(vetToken),
        });

        expect(response.status()).toBe(200);
        const sale = await response.json();
        expect(sale._id).toBe(createdSale._id);
    });

    test("Should filter sales by payment method", async ({ request }) => {
        const response = await request.get(`${BASE_URL}/sales?paymentMethod=Efectivo`, {
            headers: getAuthHeaders(vetToken),
        });

        expect(response.status()).toBe(200);
        const sales = await response.json();
        expect(Array.isArray(sales)).toBeTruthy();
    });

    test("Should filter sales by date range", async ({ request }) => {
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        const endDate = new Date();

        const response = await request.get(
            `${BASE_URL}/sales?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`,
            {
                headers: getAuthHeaders(vetToken),
            }
        );

        expect(response.status()).toBe(200);
        const sales = await response.json();
        expect(Array.isArray(sales)).toBeTruthy();
    });

    test("Should reduce inventory after sale", async ({ request }) => {
        // Obtener stock inicial
        const initialProductResponse = await request.get(`${BASE_URL}/inventory/${productId}`, {
            headers: getAuthHeaders(adminToken),
        });
        const initialProduct = await initialProductResponse.json();
        const initialStock = initialProduct.quantity; // it's quantity in the model

        // Crear venta
        const saleData = generateSaleData(productId);
        await request.post(`${BASE_URL}/sales`, {
            headers: getAuthHeaders(vetToken),
            data: saleData,
        });

        // Verificar stock actualizado
        const updatedProductResponse = await request.get(`${BASE_URL}/inventory/${productId}`, {
            headers: getAuthHeaders(adminToken),
        });
        const updatedProduct = await updatedProductResponse.json();

        expect(updatedProduct.quantity).toBe(initialStock - saleData.products[0].quantity);
    });

    test("Should get sales summary", async ({ request }) => {
        const response = await request.get(`${BASE_URL}/sales/summary`, {
            headers: getAuthHeaders(vetToken),
        });

        expect(response.status()).toBe(200);
        const summary = await response.json();
        expect(summary).toHaveProperty("totalSales");
        expect(summary).toHaveProperty("totalRevenue");
    });
});
