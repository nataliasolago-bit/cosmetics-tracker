# Cosmetics Tracker — gestión y trazabilidad de productos cosméticos

Aplicación académica con **React + Vite**, API REST **Node.js + Express + Sequelize** y **Microsoft SQL Server Express**. Administra productos, categorías, marcas, proveedores, lotes, existencias, movimientos y reportes.

> **Estado:** desarrollo universitario. Las funciones y las pruebas integradas deben verificarse en el entorno local antes de presentar la sustentación. No se incluyen contraseñas ni datos reales en el repositorio.

## Funcionalidades

- Registro e inicio de sesión con JWT y contraseñas cifradas mediante hash bcrypt; el registro público asigna el rol `operario`.
- Productos, categorías, marcas y proveedores; permisos según rol.
- Lotes con fechas de fabricación/vencimiento, inventario por lote y trazabilidad.
- Entradas y salidas con controles de stock e integridad de inventario.
- Dashboard, alertas por stock bajo, lotes vencidos y próximos a vencer.
- Reportes de inventario y movimientos, indicadores generales y exportación CSV (en la versión ampliada).
- Datos ficticios de ejemplo para demostraciones académicas (script de carga separado).

## Tecnologías

| Capa | Tecnologías |
| --- | --- |
| Interfaz | React, Vite, Axios |
| API REST | Node.js, Express |
| Persistencia | Microsoft SQL Server (Express/Developer), Sequelize y Tedious |
| Seguridad | JWT, bcrypt, autorización basada en roles |
| Pruebas | Node.js test runner y pruebas funcionales manuales |

## Estructura

```text
backend/
  database/schema.sql          # estructura inicial (instalación nueva)
  database/seed_demo.sql       # datos de prueba ficticios (si está disponible)
  src/config/                  # conexión SQL Server
  src/controllers/             # lógica de negocio
  src/models/                  # entidades Sequelize
  src/routes/                  # endpoints
  src/middlewares/             # validación de token y roles
  test/                        # pruebas automatizadas
frontend/src/                  # interfaz React
docs/                          # documentación, guía y evidencias de entrega
```

## Instalación en Windows con SQL Server Express

**Requisitos:** Node.js 22 o posterior compatible con la versión de Vite, npm, SQL Server Express y `sqlcmd` (o SSMS).

1. Clona el repositorio: `git clone https://github.com/Codeforgeettttt/cosmetics-tracker.git`.
2. Verifica que SQL Server Express funcione: `Get-Service -Name 'MSSQL$SQLEXPRESS'`.
3. En una instalación **nueva y vacía**, ejecuta `backend/database/schema.sql` mediante `sqlcmd -S ".\\SQLEXPRESS" -E -C -b -i ".\\backend\\database\\schema.sql"`. **No repitas el esquema sobre una base que ya exista**.
4. Configura autenticación SQL Server (modo mixto), un usuario SQL con permisos en `cosmetics_tracker` y TCP/IP. No utilices credenciales reales en el repositorio.
5. Dentro de `backend`, copia `.env.example` a `.env` y ajusta tu instancia o puerto, usuario, contraseña y secreto JWT. Genera una clave con `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

Ejemplo de `backend/.env` **sin secretos reales**:

```dotenv
PORT=3000
DB_SERVER=127.0.0.1
DB_PORT=1433
DB_DATABASE=cosmetics_tracker
DB_USER=cosmetics_app
DB_PASSWORD=REEMPLAZAR
DB_ENCRYPT=false
DB_TRUST_CERT=true
JWT_SECRET=GENERAR_UN_SECRETO_ALEATORIO
JWT_EXPIRES_IN=1d
```

Si usas un puerto fijo (`DB_PORT`), no configures `DB_INSTANCE`. Si usas `DB_INSTANCE=SQLEXPRESS`, comprueba que SQL Server Browser resuelva la instancia. La aplicación necesita leer correctamente estas variables en `backend/src/config/database.js`.

**PowerShell (npm bloqueado por política de ejecución):** emplea `npm.cmd` en lugar de `npm`.

### Ejecutar backend

```powershell
cd backend
npm.cmd install
npm.cmd start
```

API: `http://localhost:3000`. Verificación: `http://localhost:3000/api/health`.

### Ejecutar frontend

En **otra terminal**:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

Navegador: `http://localhost:5173/` (o puerto que indique Vite).

### Cargar datos de demostración

Solo después de crear las tablas y registrar al menos un usuario:

```powershell
sqlcmd -S "tcp:localhost,1433" -E -C -d cosmetics_tracker -b -i ".\\backend\\database\\seed_demo.sql"
```

El script debe ser la **versión corregida** que no inserta movimientos de cantidad cero. Los registros son ficticios y no sustituyen un respaldo real. Si el archivo no está en tu copia del repositorio, úsalo desde el paquete de entrega actualizado.

## Rutas principales

| Método | Ruta | Uso |
| --- | --- | --- |
| POST | `/api/auth/registro` | Registro público |
| POST | `/api/auth/login` | Autenticación |
| GET | `/api/productos` | Productos |
| GET | `/api/lotes` | Lotes |
| GET | `/api/inventario` | Inventario |
| GET/POST | `/api/movimientos` | Historial y movimientos |
| GET | `/api/reportes/resumen` | Métricas (versión ampliada) |
| GET | `/api/reportes/exportar/inventario` | CSV (versión ampliada) |
| GET | `/api/reportes/exportar/movimientos` | CSV (versión ampliada) |

Las rutas protegidas requieren `Authorization: Bearer <token>`.

## Pruebas y evidencia

- `cd backend; npm.cmd test` para ejecutar las pruebas automatizadas disponibles.
- `cd frontend; npm.cmd run build` para comprobar compilación.
- Probar manualmente login, altas de productos y lotes, movimientos, control de stock, indicadores y exportaciones.
- La entrega por **CANVAS** requiere un video grupal de **10 minutos en español**, código fuente y **exportación real de la base de datos** (esquema + datos). Un archivo `seed_demo.sql` por sí solo no demuestra el estado real de la base.

## Seguridad

Nunca subas `.env`, secretos JWT, contraseñas SQL, `node_modules`, respaldos privados ni datos personales reales. Las credenciales expuestas deben rotarse. Revisa el contenido de un commit antes de publicarlo.

## Autores

- Natalia Larrañaga
- Jairo Barrios
- Valery Roca
- Daniel Rojas
