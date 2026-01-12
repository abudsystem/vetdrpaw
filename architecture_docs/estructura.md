# Estructura del Proyecto

```text
app
├── activar
├── administrador
|───|───|activos/
|───|───|balance/
|───|───|calendario/
|───|───|copiainventario/
|───|───|dashboard/
|───|───|flujodecaja/
|───|───|galeria/
|───|───|inventario/
|───|───|negocio/
|───|───|pasivos/
|───|───|perfil/
|───|───|pet-care/
|───|───|roles/
|───|───|servicios/
|───|───|usuarios/
|───|───|layout.tsx
|───|───|page.tsx
├── api/
├───|───|admin/
├───|───|analytics/
├───|───|appointments/
├───|───|assets/
├───|───|auth/
├───|───|backups/
├───|───|calendar-events/
├───|───|cashflow/
├───|───|cliente/
├───|───|debug/
├───|───|inventory/
├───|───|liabilities/
├───|───|medical-records/
├───|───|pet-care/
├───|───|pets/
├───|───|sales/
├───|───|services/
├───|───|users/
├───|───|veterinario/
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   ├── cliente/
│   │   ├── citas/
│   │   ├── dashboard/
│   │   ├── mascotas/
│   │   ├── perfil/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   |── contacto/
│   |── cuidado-mascota/
│   |── login/
│   |── register/
│   |── servicios/
│   |── sobre/
│   |── veterinario/
│   |── |── |── citas/
│   |── |── |── dashboard/
│   |── |── |── mascotas/
│   |── |── |── perfil/
│   |── |── |── servicios/
│   |── |── |── usuarios-invitados/
│   |── |── |── ventas/
│   |── |── |── layout.tsx
│   |── |── |── page.tsx


architecture_docs
├── architecture_flowchart.md
├── basededatos.md
├── estructura_general.md
├── estructura.md
└── EstructureDB.ts

components
├── about/
├── admin/
├── administrador/
├── cliente/
├── contact/
├── home/
├── layout/
├── pet-care/
├── providers/
├── services/
├── sobre/
├── ui/
└── veterinario/
├── AppointmentDetails.tsx
├── AppointmentList.tsx
├── AppointmenForm.tsx
├── CreateAppointmentForm.tsx
├── GoogleCalendarButton.tsx
├── ServiceForm.tsx
├── WhatsAppButton.tsx


controllers
├── appointment.controller.ts
├── analytics.controller.ts
├── asset.controller.ts
├── auth.controller.ts
├── backup.controller.ts
├── calendar-event.controller.ts
├── cashflow.controller.ts
├── inventory.controller.ts
├── liability.controller.ts
├── medical-record.controller.ts
├── pet-care.controller.ts
├── pet.controller.ts
├── sales.controller.ts
├── services.controller.ts
├── user.controller.ts


hooks
├── useAppointments.ts
├── useCalendarEvents.ts
├── useInventory.ts
├── useOnScreen.ts
├── usePagination.ts
├── usePetCare.ts
├── usePets.ts
├── useProfile.ts
├── useServices.ts
├── useUsers.ts
├── useVetAppointments.ts

i18n
├── request.ts
└── routing.ts

lib
├── api.ts
├── api-handler.ts
├── db.ts
└── jwt.ts

messages
middleware
└── auth.middleware.ts

models
├── Appointment.ts
├── Pet.ts
└── User.ts

public
repositories
├── appointment.repo.ts
├── pet.repo.ts
└── user.repo.ts

rest
scripts
services
├── client
│   ├── inventory.service.ts
│   ├── pet.service.ts
│   └── user.service.ts
└── auth.service.ts

tests
├── auth.setup.ts
├── setup-vitest.ts
├── admin
├── auth
├── cliente
└── veterinario

types
.env
.gitignore
eslint.config.mjs
next.config.ts
package.json
playwright.config.ts
vitest.config.ts
proxy.ts
README.md
tsconfig.json
```
