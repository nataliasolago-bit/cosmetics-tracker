# Sistema Web de Gestión y Trazabilidad de Productos Cosméticos

Aplicación web para el registro, control de inventario y trazabilidad de productos cosméticos, incluyendo gestión de categorías, marcas, proveedores, lotes y movimientos de inventario.

## Funcionalidades

- Registro e inicio de sesión de usuarios
- Roles y permisos (admin / operario)
- CRUD de productos, categorías, marcas y proveedores
- Gestión de lotes e inventario
- Registro de entradas y salidas de productos
- Historial de trazabilidad por producto/lote
- Alertas de lotes vencidos, próximos a vencer y stock bajo
- Búsqueda y filtrado de productos
- Reportes básicos

## Tecnologías

- **Frontend:** React (Vite) + Axios
- **Backend:** Node.js + Express + Sequelize
- **Base de datos:** MySQL
- **Autenticación:** JWT + bcrypt

## Estructura del proyecto
cosmetics-tracker/
├── backend/ # API REST (Node.js + Express)
│ ├── src/
│ │ ├── config/ # Conexión a la base de datos, variables de entorno
│ │ ├── models/ # Modelos Sequelize
│ │ ├── controllers/ # Lógica de negocio
│ │ ├── routes/ # Definición de endpoints
│ │ ├── middlewares/ # Autenticación, permisos, manejo de errores
│ │ └── app.js
│ └── .env
├── frontend/ # Interfaz de usuario (React)
└── README.md

## Instalación y configuración

### Requisitos previos

- [Node.js](https://nodejs.org) (versión LTS)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/)
- Git

### 1. Clonar el repositorio

```bash
git clone https://github.com/<tu-usuario>/cosmetics-tracker.git
cd cosmetics-tracker
```

### 2. Configurar el backend

```bash
cd backend
npm install
```

Crea un archivo `.env` en `backend/` con el siguiente contenido (ajusta los valores a tu entorno):
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=cosmetics_tracker
JWT_SECRET=una_clave_secreta_larga_y_segura


Crea la base de datos en MySQL:

```sql
CREATE DATABASE cosmetics_tracker;
```

### 3. Configurar el frontend

```bash
cd ../frontend
npm install
```

## Cómo ejecutar el proyecto

### Backend

```bash
cd backend
npm run dev
```

El servidor quedará escuchando en `http://localhost:3000`.

### Frontend

```bash
cd frontend
npm run dev
```

La aplicación quedará disponible en `http://localhost:5173` (puerto por defecto de Vite).

## Endpoints principales de la API

Todas las rutas (excepto registro/login) requieren el header:
Authorization: Bearer <token>


| Método | Ruta | Descripción | Rol requerido |
|--------|------|--------------|----------------|
| POST | `/api/auth/registro` | Registrar usuario | Público |
| POST | `/api/auth/login` | Iniciar sesión | Público |
| GET/POST/PUT | `/api/productos` | CRUD de productos | Autenticado |
| DELETE | `/api/productos/:id` | Eliminar producto | Admin |
| GET/POST/PUT | `/api/categorias` | CRUD de categorías | Autenticado |
| GET/POST/PUT | `/api/marcas` | CRUD de marcas | Autenticado |
| GET/POST/PUT | `/api/proveedores` | CRUD de proveedores | Autenticado |
| GET/POST/PUT | `/api/lotes` | CRUD de lotes | Autenticado |
| GET | `/api/lotes/vencidos` | Lotes vencidos | Autenticado |
| GET | `/api/lotes/proximos-a-vencer` | Lotes próximos a vencer | Autenticado |
| GET | `/api/inventario` | Listado de inventario | Autenticado |
| GET | `/api/inventario/stock-bajo` | Productos con stock bajo | Autenticado |
| POST | `/api/movimientos` | Registrar entrada/salida | Autenticado |
| GET | `/api/movimientos/producto/:id` | Historial por producto | Autenticado |
| GET | `/api/movimientos/lote/:id` | Historial por lote | Autenticado |

## Autores

- Natalia Larrañaga
- Jairo Barrios
- Valery Roca
- Daniel Rojas