import { defineConfig, devices } from '@playwright/test';

/**
 * Configuración de Playwright para pruebas E2E
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
    testDir: './tests',

    /* Tiempo máximo que una prueba puede ejecutarse */
    timeout: 30 * 1000,

    /* Configuración de expect */
    expect: {
        timeout: 5000
    },

    /* Ejecutar pruebas en paralelo */
    fullyParallel: true,

    /* Fallar el build en CI si dejaste test.only por accidente */
    forbidOnly: !!process.env.CI,

    /* Reintentos en CI */
    retries: process.env.CI ? 2 : 0,

    /* Workers en paralelo */
    workers: process.env.CI ? 1 : undefined,

    /* Reporter */
    reporter: 'html',

    /* Configuración compartida para todos los proyectos */
    use: {
        /* URL base para usar en acciones como `await page.goto('/')` */
        baseURL: 'http://localhost:3000',

        /* Recolectar trace en el primer reintento de una prueba fallida */
        trace: 'on-first-retry',

        /* Screenshot solo en fallas */
        screenshot: 'only-on-failure',

        /* Video solo en fallas */
        video: 'retain-on-failure',
    },

    /* Configurar proyectos para diferentes navegadores */
    projects: [
        {
            name: 'setup',
            testMatch: /auth\.setup\.ts/,
        },
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                // Use prepared auth state.
                storageState: 'playwright/.auth/client.json',
            },
            dependencies: ['setup'],
        },
        {
            name: 'vet-chromium',
            use: {
                ...devices['Desktop Chrome'],
                storageState: 'playwright/.auth/vet.json',
            },
            dependencies: ['setup'],
        },
        /* Firefox y Webkit también pueden usar sus propios estados si se desea */
        {
            name: 'firefox',
            use: {
                ...devices['Desktop Firefox'],
                storageState: 'playwright/.auth/client.json',
            },
            dependencies: ['setup'],
        },
    ],

    /* Ejecutar el servidor de desarrollo antes de las pruebas */
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
    },
});
