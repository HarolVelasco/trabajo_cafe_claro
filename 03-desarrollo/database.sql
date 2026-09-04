CREATE DATABASE IF NOT EXISTS guayaba_clara CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE guayaba_clara;

CREATE TABLE usuarios (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  correo VARCHAR(180) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('cliente','administrador') NOT NULL DEFAULT 'cliente',
  activo TINYINT(1) NOT NULL DEFAULT 1,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_usuarios_correo (correo)
) ENGINE=InnoDB;

CREATE TABLE categorias (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL,
  UNIQUE KEY uq_categorias_nombre (nombre)
) ENGINE=InnoDB;

CREATE TABLE productos (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  categoria_id INT UNSIGNED NOT NULL,
  nombre VARCHAR(120) NOT NULL,
  descripcion TEXT NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  imagen VARCHAR(255) NOT NULL DEFAULT '',
  cantidad_disponible INT UNSIGNED NOT NULL DEFAULT 0,
  stock_minimo INT UNSIGNED NOT NULL DEFAULT 5,
  estado ENUM('activo','inactivo') NOT NULL DEFAULT 'activo',
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_productos_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id),
  INDEX ix_productos_estado (estado)
) ENGINE=InnoDB;

CREATE TABLE clientes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  correo VARCHAR(180) NOT NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_clientes_correo (correo)
) ENGINE=InnoDB;

CREATE TABLE pedidos (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT UNSIGNED NOT NULL,
  usuario_id INT UNSIGNED NULL,
  necesidad VARCHAR(80) NOT NULL,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  estado ENUM('recibido','en_revision','confirmado','cancelado') NOT NULL DEFAULT 'recibido',
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pedidos_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id),
  CONSTRAINT fk_pedidos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  INDEX ix_pedidos_creado_en (creado_en),
  INDEX ix_pedidos_estado (estado)
) ENGINE=InnoDB;

CREATE TABLE pedido_detalles (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT UNSIGNED NOT NULL,
  producto VARCHAR(120) NOT NULL,
  cantidad SMALLINT UNSIGNED NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_detalles_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE metricas_atencion (
  id TINYINT UNSIGNED PRIMARY KEY,
  personas_atendidas INT UNSIGNED NOT NULL DEFAULT 0,
  suma_calificaciones INT UNSIGNED NOT NULL DEFAULT 0,
  cantidad_calificaciones INT UNSIGNED NOT NULL DEFAULT 0,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO metricas_atencion (id) VALUES (1);

CREATE TABLE opiniones_clientes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  calificacion TINYINT UNSIGNED NOT NULL,
  recomendacion TEXT NOT NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_opinion_calificacion CHECK (calificacion BETWEEN 1 AND 5),
  INDEX ix_opiniones_creado_en (creado_en)
) ENGINE=InnoDB;

CREATE TABLE promociones (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(120) NOT NULL,
  mensaje TEXT NOT NULL,
  activa TINYINT(1) NOT NULL DEFAULT 1,
  creado_por INT UNSIGNED NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_promociones_usuario FOREIGN KEY (creado_por) REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX ix_promociones_activa (activa)
) ENGINE=InnoDB;

-- Migracion para bases creadas antes de esta funcionalidad:
-- ALTER TABLE usuarios ADD COLUMN telefono VARCHAR(20) NOT NULL DEFAULT '' AFTER correo;

INSERT INTO categorias (nombre) VALUES ('Cafés de origen'), ('Accesorios'), ('Regalos');
INSERT INTO productos (categoria_id, nombre, descripcion, precio, cantidad_disponible, stock_minimo, estado) VALUES
  (1, 'Origen Quindío', 'Notas de caramelo y chocolate. Suave, dulce y equilibrado.', 32900, 24, 5, 'activo'),
  (1, 'Reserva Huila', 'Aromas florales y notas cítricas para métodos filtrados.', 36500, 12, 5, 'activo'),
  (3, 'Kit de barista', 'Café de origen, prensa francesa y cuchara medidora.', 74900, 7, 3, 'activo');

INSERT INTO usuarios (nombre, correo, telefono, password_hash, rol)
VALUES ('Administrador Café Claro', 'admin@cafeclaro.com', '', '$2y$10$rAZ23sPyj3WN9sKnx7sH..GSfXT2nr81AjoLpJdOZrY/i43YrV5o.', 'administrador')
ON DUPLICATE KEY UPDATE rol = 'administrador', activo = 1;
