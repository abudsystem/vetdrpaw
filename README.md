/Veterinaria DrPaws
 ├── app
 │    └── api
 │         └── (rutas Modulares)
 │              ├── auth
 │              │     └── login
 │              │     └── register
 │              │
 │              ├── pets
 │              │     └── create
 │              │     └── list
 │              │     └── [id]
 │              │           └── get
 │              │           └── update
 │              │           └── delete
 │              │           └── features
 │              │                └── add
 │              │                └── remove
 │              │
 │              ├── appointments
 │              │     └── create
 │              │     └── list
 │              │     └── [id]
 │              │           └── update
 │              │           └── cancel
 │              │
 │              └── users
 │                    └── me
 │                    └── change-role
 │
 ├── controllers
 │    ├── auth.controller.ts
 │    ├── pet.controller.ts
 │    ├── appointment.controller.ts
 │    └── user.controller.ts
 │
 ├── services
 │    ├── auth.service.ts
 │    ├── pet.service.ts
 │    ├── appointment.service.ts
 │    └── user.service.ts
 │
 ├── repositories
 │    ├── user.repo.ts
 │    ├── pet.repo.ts
 │    └── appointment.repo.ts
 │
 ├── models
 │    ├── User.ts
 │    ├── Pet.ts
 │    └── Appointment.ts
 │
 ├── lib
 │    ├── db.ts
 │    ├── jwt.ts
 │    └── permissions.ts
 │
 └── middleware
      ├── auth.ts
      ├── requireRole.ts
      └── validateBody.ts
