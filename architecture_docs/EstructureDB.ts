import mongoose from 'mongoose';
//import 'dotenv/config';

async function printSchemas() {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI no está definida');
    }

    // Conexión a MongoDB (fuera del runtime de Next.js)
    await mongoose.connect(process.env.MONGODB_URI);

    // Importación dinámica ESM (OBLIGATORIO usar .js)
    await import('../models/Appointment.js');
    await import('../models/Asset.js');
    await import('../models/Backup.js');
    await import('../models/CashFlow.js');
    await import('../models/InventoryMovement.js');
    await import('../models/Liability.js');
    await import('../models/MedicalRecord.js');
    await import('../models/Pet.js');
    await import('../models/Product.js');
    await import('../models/Service.js');
    await import('../models/User.js');

    const models = mongoose.models;

    for (const modelName in models) {
        const schema = models[modelName].schema.paths;

        console.log(`\nColección: ${modelName}`);
        for (const field in schema) {
            console.log(`- ${field}: ${schema[field].instance}`);
        }
    }

    await mongoose.disconnect();
}

printSchemas().catch(console.error);
