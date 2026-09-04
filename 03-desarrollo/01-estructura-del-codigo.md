# Estructura del Código – Guayaba Clara

```
guayaba-clara/
├── index.html              # Página principal (catálogo + carrito + cuenta)
├── login.html              # Inicio de sesión
├── register.html           # Registro de clientes
├── admin.html              # Panel de administración
├── styles.css              # Estilos globales
├── script.js               # Lógica principal del frontend
├── portal.js               # Lógica de portal / cuenta
├── admin.js                # Lógica del panel admin
├── database.sql            # Script de creación de la base de datos
├── README-XAMPP.md         # Instrucciones de instalación local
└── api/
    ├── config.php          # Configuración (DB + WhatsApp)
    ├── db.php              # Conexión a MySQL
    ├── auth.php            # Registro, login, sesión
    ├── products.php        # CRUD productos
    ├── order.php           # Crear pedido
    ├── orders.php          # Consultar pedidos
    ├── promotions.php      # Promociones WhatsApp
    └── metrics.php         # Métricas del negocio
```

## Convenciones de desarrollo
- Endpoints PHP responden en JSON.
- Uso de `password_hash()` / `password_verify()` para contraseñas.
- Transacciones SQL al crear pedidos (cliente + pedido + detalles + descuento de stock).
- Validación de entrada tanto en frontend como en backend.
- Roles controlados por la columna `rol` en la tabla `usuarios`.
