# Modelo de Datos – Guayaba Clara

## Entidades principales

### usuarios
| Campo          | Tipo              | Descripción                          |
|----------------|-------------------|--------------------------------------|
| id             | INT PK            | Identificador                        |
| nombre         | VARCHAR(120)      | Nombre completo                      |
| correo         | VARCHAR(180) UNIQUE | Correo electrónico                 |
| telefono       | VARCHAR(20)       | Número WhatsApp (formato internacional) |
| password_hash  | VARCHAR(255)      | Hash de la contraseña                |
| rol            | ENUM('cliente','administrador') | Rol del usuario            |
| activo         | TINYINT(1)        | Estado de la cuenta                  |
| creado_en      | TIMESTAMP         | Fecha de registro                    |

### categorias
| Campo   | Tipo         | Descripción      |
|---------|--------------|------------------|
| id      | INT PK       | Identificador    |
| nombre  | VARCHAR(80)  | Nombre categoría |

### productos
| Campo               | Tipo              | Descripción                    |
|---------------------|-------------------|--------------------------------|
| id                  | INT PK            | Identificador                  |
| categoria_id        | INT FK            | Categoría                      |
| nombre              | VARCHAR(120)      | Nombre del producto            |
| descripcion         | TEXT              | Descripción                    |
| precio              | DECIMAL(10,2)     | Precio                         |
| imagen              | VARCHAR(255)      | Ruta o URL de imagen           |
| cantidad_disponible | INT               | Stock actual                   |
| stock_minimo        | INT               | Umbral de alerta               |
| estado              | ENUM('activo','inactivo') | Estado del producto     |
| creado_en / actualizado_en | TIMESTAMP  | Auditoría                      |

### clientes
| Campo     | Tipo         | Descripción              |
|-----------|--------------|--------------------------|
| id        | INT PK       | Identificador            |
| nombre    | VARCHAR(120) | Nombre                   |
| correo    | VARCHAR(180) UNIQUE | Correo              |
| creado_en / actualizado_en | TIMESTAMP | Auditoría         |

### pedidos
| Campo       | Tipo              | Descripción                          |
|-------------|-------------------|--------------------------------------|
| id          | INT PK            | Identificador                        |
| cliente_id  | INT FK            | Cliente                              |
| usuario_id  | INT FK NULL       | Usuario registrado (si aplica)       |
| necesidad   | VARCHAR(80)       | Tipo de necesidad / observación      |
| total       | DECIMAL(10,2)     | Total del pedido                     |
| estado      | ENUM('recibido','en_revision','confirmado','cancelado') | Estado |
| creado_en   | TIMESTAMP         | Fecha del pedido                     |

### pedido_detalles
| Campo       | Tipo          | Descripción               |
|-------------|---------------|---------------------------|
| id          | INT PK        | Identificador             |
| pedido_id   | INT FK        | Pedido                    |
| producto_id | INT FK        | Producto                  |
| cantidad    | INT           | Cantidad                  |
| precio      | DECIMAL(10,2) | Precio unitario aplicado  |

### promociones
| Campo         | Tipo          | Descripción                    |
|---------------|---------------|--------------------------------|
| id            | INT PK        | Identificador                  |
| titulo        | VARCHAR(120)  | Título de la promoción         |
| mensaje       | TEXT          | Contenido del mensaje          |
| activa        | TINYINT(1)    | Si está activa                 |
| creado_por    | INT FK NULL   | Administrador que la creó      |
| creado_en / actualizado_en | TIMESTAMP | Auditoría               |

## Relaciones
- Un **usuario** puede tener muchos **pedidos**.
- Un **pedido** pertenece a un **cliente** y opcionalmente a un **usuario**.
- Un **pedido** tiene muchos **pedido_detalles**.
- Un **producto** pertenece a una **categoría**.
- Un **producto** puede aparecer en muchos **pedido_detalles**.
