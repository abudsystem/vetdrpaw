/**
 * Generadores de datos de prueba
 */

export function generatePetData() {
    const timestamp = Date.now();
    return {
        name: `Mascota Test ${timestamp}`,
        species: "Perro",
        breed: "Labrador",
        age: 3,
        weight: 25.5,
    };
}

export function generateProductData() {
    const timestamp = Date.now();
    return {
        name: `Producto Test ${timestamp}`,
        description: "Descripción del producto de prueba",
        category: "Medicamentos",
        price: 50.00,
        stock: 100,
        minStock: 10,
    };
}

export function generateServiceData() {
    const timestamp = Date.now();
    return {
        name: `Servicio Test ${timestamp}`,
        description: "Descripción del servicio de prueba",
        basePrice: 100.00,
        duration: 60,
        isActive: true,
    };
}

export function generateAssetData() {
    const timestamp = Date.now();
    return {
        name: `Activo Test ${timestamp}`,
        category: "Equipamiento",
        quantity: 1,
        unitCost: 5000.00,
        acquisitionDate: new Date().toISOString().split('T')[0],
        isDepreciable: true,
        usefulLifeMonths: 60,
    };
}

export function generateLiabilityData() {
    const timestamp = Date.now();
    return {
        description: `Pasivo Test ${timestamp}`,
        amount: 10000.00,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        isPaid: false,
    };
}

export function generateCashFlowData(type: "ingreso" | "egreso" = "ingreso") {
    const timestamp = Date.now();
    return {
        description: `${type === "ingreso" ? "Ingreso" : "Egreso"} Test ${timestamp}`,
        amount: 500.00,
        type,
        category: type === "ingreso" ? "Ventas" : "Gastos operativos",
        date: new Date().toISOString().split('T')[0],
    };
}

export function generateAppointmentData() {
    // Fecha para mañana a las 10:00 AM
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    return {
        date: tomorrow.toISOString(),
        reason: "Consulta general de prueba",
        notes: "Notas de la cita de prueba",
    };
}

export function generateMedicalRecordData() {
    return {
        diagnosis: "Diagnóstico de prueba",
        treatment: "Tratamiento de prueba",
        notes: "Notas del historial médico de prueba",
        weight: 26.0,
        temperature: 38.5,
    };
}

export function generateSaleData(productId: string) {
    return {
        products: [
            {
                product: productId,
                quantity: 2,
                price: 50.00,
            },
        ],
        paymentMethod: "Efectivo",
    };
}
