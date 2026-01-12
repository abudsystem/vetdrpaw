import { test as setup, expect } from '@playwright/test';
import { createTestUser, loginUserUI } from './helpers/auth';

const adminFile = 'playwright/.auth/admin.json';
const vetFile = 'playwright/.auth/vet.json';
const clientFile = 'playwright/.auth/client.json';

setup('authenticate as vet', async ({ page, request }) => {
    // We use a fixed email for the "stable" test vet to avoid creating millions of users
    // But for the setup, we can just create one if it fails or just login
    const email = 'vet_stable_test@example.com';
    const password = 'Test123456';

    try {
        await loginUserUI(page, email, password);
    } catch (e) {
        // If login fails, register and then login
        await request.post('http://localhost:3000/api/auth/register', {
            data: {
                name: 'Stable Vet',
                email,
                password,
                role: 'veterinario'
            }
        });
        await loginUserUI(page, email, password);
    }

    await page.context().storageState({ path: vetFile });
});

setup('authenticate as client', async ({ page, request }) => {
    const email = 'client_stable_test@example.com';
    const password = 'Test123456';

    try {
        await loginUserUI(page, email, password);
    } catch (e) {
        await request.post('http://localhost:3000/api/auth/register', {
            data: {
                name: 'Stable Client',
                email,
                password,
                role: 'cliente'
            }
        });
        await loginUserUI(page, email, password);
    }

    await page.context().storageState({ path: clientFile });
});
