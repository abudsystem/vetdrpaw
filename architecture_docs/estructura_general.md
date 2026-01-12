# Especificaciones Generales - Veterinaria DrPaw

Aplicación web para veterinaria desarrollada en **TypeScript** con **Next.js**, **MongoDB** y **Node.js**.

## Funcionalidades
Tendra 3 roles de usuarios:
- **Veterinarios**: Pueden modificar los datos de cada mascota del cliente.
- **Clientes**: Pueden visualizar los datos de sus mascotas y las citas que el veterinario cree.
- **Administrador**: Gestión de roles y usuarios.

## Estructura de Páginas

### Página de Inicio
- Sector de bienvenida.
- Filosofía de la clínica.
- Servicios.
- Comentarios y testimonios.
- Política de bienestar animal.
- Historia y valores.

### Sobre Nosotros
- Misión y equipo veterinario.
- Redes sociales (Facebook, Instagram, WhatsApp, Correo).
- Información del dueño/director.

### Contacto
- Formulario de contacto vía email.
- Enlace directo a WhatsApp.

### Servicios
#### Veterinarios
- Consultas (General, Urgencias 24h).
- Controles (Crecimiento, Geriátrico, Postoperatorio).
- Vacunaciones y Desparasitaciones.
- Cirugías (Esterilización, Tejidos blandos, Emergencia).
- Hospitalización 24h.

#### Complementarios
- Alimentos clínicos y accesorios.
- Estética (Cortes de pelo, Baños medicados).
- Spa (Baño + Corte + Uñas).
- Certificados (Vacunación, Viaje, Adopción).

## Flujo de Usuario
1. **Agendar Cita**: Requiere Login.
2. **Registro**: Si el usuario no tiene cuenta.

## Dashboards

### Cliente
- `/cliente/citas`: Visualización de citas propias.
- `/cliente/mascotas`: Gestión (CRUD) de mascotas personales.
- `/cliente/perfil`: Edición de datos básicos e historial.

### Veterinario
- `/veterinario/citas`: Creación y gestión de citas para clientes.
- `/veterinario/mascotas`: Acceso global a mascotas y clientes.
- `/veterinario/dashboard`: Métricas generales.

### Administrador
- `/administrador/roles`: Gestión de permisos.
- `/administrador/usuarios`: CRUD de usuarios del sistema.

## Contenido Informativo
- Blog y artículos sobre cuidado de mascotas.
