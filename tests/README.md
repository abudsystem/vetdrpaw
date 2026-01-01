# Pruebas E2E con Playwright

Este directorio contiene todas las pruebas end-to-end (E2E) para la aplicación Veterinaria DrPaw.

## 📁 Estructura de Pruebas

```
tests/
├── helpers/
│   ├── auth.ts           # Helpers de autenticación
│   └── test-data.ts      # Generadores de datos de prueba
├── auth.spec.ts          # Pruebas de autenticación
├── admin/
│   ├── users.spec.ts     # CRUD de usuarios
│   ├── inventory.spec.ts # CRUD de inventario
│   ├── services.spec.ts  # CRUD de servicios
│   ├── assets.spec.ts    # CRUD de activos
│   ├── liabilities.spec.ts # CRUD de pasivos
│   └── cashflow.spec.ts  # Gestión de flujo de caja
├── veterinario/
│   ├── appointments.spec.ts      # Gestión de citas
│   ├── medical-records.spec.ts   # Historiales médicos
│   └── sales.spec.ts             # Gestión de ventas
└── cliente/
    ├── pets.spec.ts              # CRUD de mascotas
    └── appointments.spec.ts      # Reserva de citas
```

## 🚀 Comandos Disponibles

```bash
# Ejecutar todas las pruebas
npm run test:e2e

# Ejecutar pruebas en modo UI (interactivo)
npm run test:e2e:ui

# Ejecutar pruebas en modo debug
npm run test:e2e:debug

# Ejecutar solo pruebas de autenticación
npx playwright test tests/auth.spec.ts

# Ejecutar solo pruebas de administrador
npx playwright test tests/admin

# Ejecutar solo pruebas de veterinario
npx playwright test tests/veterinario

# Ejecutar solo pruebas de cliente
npx playwright test tests/cliente

# Ver el reporte de las últimas pruebas
npm run test:e2e:report
```

## 📋 Cobertura de Pruebas

### Autenticación
- ✅ Registro de usuarios (cliente, veterinario)
- ✅ Login con credenciales válidas/inválidas
- ✅ Logout
- ✅ Redirección según rol
- ✅ Persistencia de sesión

### Administrador
- ✅ **Usuarios**: CRUD completo, cambio de roles
- ✅ **Inventario**: CRUD, movimientos, alertas de stock bajo
- ✅ **Servicios**: CRUD, activación/desactivación
- ✅ **Activos**: CRUD, cálculo de valor total
- ✅ **Pasivos**: CRUD, marcar como pagado
- ✅ **Flujo de Caja**: Ingresos/egresos, resumen financiero

### Veterinario
- ✅ **Citas**: Listado, actualización de estado, filtros
- ✅ **Historiales Médicos**: CRUD por mascota
- ✅ **Ventas**: Registro, actualización de inventario

### Cliente
- ✅ **Mascotas**: CRUD completo, privacidad de datos
- ✅ **Citas**: Reserva, actualización, cancelación

## 🔧 Configuración

La configuración de Playwright se encuentra en `playwright.config.ts` y incluye:

- **Navegadores**: Chromium, Firefox, WebKit
- **Dispositivos móviles**: Pixel 5, iPhone 12
- **Timeouts**: 30s por prueba, 5s para expects
- **Reintentos**: 2 en CI, 0 en local
- **Screenshots y videos**: Solo en fallas
- **Servidor**: Auto-inicio de `npm run dev`

## 📝 Escribir Nuevas Pruebas

### Ejemplo básico:

```typescript
import { test, expect } from "@playwright/test";
import { createTestUser, loginUser, getAuthHeaders } from "../helpers/auth";

test.describe("Mi Nueva Funcionalidad", () => {
  let userToken: string;

  test.beforeEach(async ({ request }) => {
    const user = await createTestUser(request, "cliente");
    userToken = await loginUser(request, user.email, user.password);
  });

  test("Should do something", async ({ request }) => {
    const response = await request.get("http://localhost:3000/api/endpoint", {
      headers: getAuthHeaders(userToken),
    });

    expect(response.status()).toBe(200);
  });
});
```

## 🛠️ Helpers Disponibles

### `auth.ts`
- `createTestUser()` - Crea un usuario de prueba
- `loginUser()` - Hace login y retorna el token
- `loginUserUI()` - Login a través de la interfaz
- `logoutUser()` - Cierra sesión
- `getAuthHeaders()` - Retorna headers con autenticación

### `test-data.ts`
- `generatePetData()` - Datos de mascota
- `generateProductData()` - Datos de producto
- `generateServiceData()` - Datos de servicio
- `generateAssetData()` - Datos de activo
- `generateLiabilityData()` - Datos de pasivo
- `generateCashFlowData()` - Datos de flujo de caja
- `generateAppointmentData()` - Datos de cita
- `generateMedicalRecordData()` - Datos de historial médico
- `generateSaleData()` - Datos de venta

## 🐛 Debugging

Para debuggear una prueba específica:

```bash
# Modo debug con Playwright Inspector
npx playwright test tests/auth.spec.ts --debug

# Ejecutar con headed browser
npx playwright test tests/auth.spec.ts --headed

# Ver trace de una prueba fallida
npx playwright show-trace trace.zip
```

## 📊 CI/CD

Las pruebas están configuradas para ejecutarse en CI con:
- 2 reintentos automáticos
- 1 worker (ejecución secuencial)
- Screenshots y videos de fallas
- Reporte HTML generado

## 🔒 Seguridad en Pruebas

- Cada prueba crea usuarios únicos con timestamps
- Los tokens se generan dinámicamente
- Las pruebas verifican permisos y privacidad de datos
- No se usan credenciales hardcodeadas

## 📈 Mejores Prácticas

1. **Aislamiento**: Cada prueba debe ser independiente
2. **Limpieza**: Usa `beforeEach` y `afterEach` apropiadamente
3. **Datos únicos**: Usa timestamps para evitar colisiones
4. **Assertions claras**: Usa expects descriptivos
5. **Timeouts razonables**: No uses waits arbitrarios
