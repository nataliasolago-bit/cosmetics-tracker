-- Crear base de datos
CREATE DATABASE cosmetics_tracker;
GO
USE cosmetics_tracker;
GO

-- Tabla roles
CREATE TABLE roles (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(50) NOT NULL UNIQUE
);
GO

-- Tabla categorias
CREATE TABLE categorias (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100) NOT NULL UNIQUE,
    descripcion NVARCHAR(255) NULL
);
GO

-- Tabla marcas
CREATE TABLE marcas (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100) NOT NULL UNIQUE,
    descripcion NVARCHAR(255) NULL
);
GO

-- Tabla proveedores
CREATE TABLE proveedores (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(150) NOT NULL,
    contacto NVARCHAR(150) NULL,
    telefono NVARCHAR(30) NULL,
    email NVARCHAR(150) NULL
);
GO

-- Tabla usuarios
CREATE TABLE usuarios (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(150) NOT NULL,
    email NVARCHAR(150) NOT NULL UNIQUE,
    password_hash NVARCHAR(255) NOT NULL,
    rol_id INT NOT NULL,
    creado_en DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_usuarios_roles FOREIGN KEY (rol_id) REFERENCES roles(id)
);
GO

-- Tabla productos
CREATE TABLE productos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(150) NOT NULL,
    descripcion NVARCHAR(500) NULL,
    categoria_id INT NOT NULL,
    marca_id INT NOT NULL,
    proveedor_id INT NOT NULL,
    precio DECIMAL(10,2) NOT NULL DEFAULT 0,
    stock_minimo INT NOT NULL DEFAULT 0,
    creado_en DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_productos_categorias FOREIGN KEY (categoria_id) REFERENCES categorias(id),
    CONSTRAINT FK_productos_marcas FOREIGN KEY (marca_id) REFERENCES marcas(id),
    CONSTRAINT FK_productos_proveedores FOREIGN KEY (proveedor_id) REFERENCES proveedores(id)
);
GO

-- Tabla lotes
CREATE TABLE lotes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    producto_id INT NOT NULL,
    numero_lote NVARCHAR(50) NOT NULL,
    fecha_fabricacion DATE NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    cantidad_inicial INT NOT NULL,
    CONSTRAINT FK_lotes_productos FOREIGN KEY (producto_id) REFERENCES productos(id),
    CONSTRAINT UQ_lote_producto UNIQUE (producto_id, numero_lote)
);
GO

-- Tabla inventario
CREATE TABLE inventario (
    id INT IDENTITY(1,1) PRIMARY KEY,
    producto_id INT NOT NULL,
    lote_id INT NOT NULL,
    cantidad_actual INT NOT NULL DEFAULT 0,
    actualizado_en DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_inventario_productos FOREIGN KEY (producto_id) REFERENCES productos(id),
    CONSTRAINT FK_inventario_lotes FOREIGN KEY (lote_id) REFERENCES lotes(id),
    CONSTRAINT UQ_inventario_lote UNIQUE (lote_id)
);
GO

-- Tabla movimientos
CREATE TABLE movimientos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    producto_id INT NOT NULL,
    lote_id INT NOT NULL,
    tipo NVARCHAR(10) NOT NULL,
    cantidad INT NOT NULL,
    motivo NVARCHAR(255) NULL,
    usuario_id INT NOT NULL,
    fecha DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_movimientos_productos FOREIGN KEY (producto_id) REFERENCES productos(id),
    CONSTRAINT FK_movimientos_lotes FOREIGN KEY (lote_id) REFERENCES lotes(id),
    CONSTRAINT FK_movimientos_usuarios FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    CONSTRAINT CK_movimientos_tipo CHECK (tipo IN ('entrada', 'salida'))
);
GO
