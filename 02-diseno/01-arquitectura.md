# Arquitectura del Sistema – Guayaba Clara

## Estilo arquitectónico
Arquitectura **cliente-servidor** clásica con separación clara entre frontend y backend.

```
[ Navegador (HTML + CSS + JS) ]
            |
            |  HTTP (fetch / formularios)
            v
[ Servidor Apache + PHP (API) ]
            |
            v
[ MySQL / MariaDB ]
```

## Capas

### 1. Presentación (Frontend)
- `index.html` → página principal, catálogo, carrito, autenticación
- `login.html` / `register.html` → autenticación dedicada
- `admin.html` → panel de administración
- `styles.css` → estilos globales
- `script.js`, `portal.js`, `admin.js` → lógica de interfaz y llamadas a la API

### 2. Lógica de negocio / API (Backend PHP)
Carpeta `api/`:
- `auth.php` → registro, login, sesión
- `products.php` → CRUD de productos
- `order.php` / `orders.php` → creación y consulta de pedidos
- `promotions.php` → gestión y envío de promociones
- `metrics.php` → métricas del negocio
- `config.php` / `db.php` → configuración y conexión

### 3. Persistencia
- Base de datos `guayaba_clara`
- Script de creación: `database.sql`

## Decisiones de diseño importantes
- **Sin framework frontend**: JavaScript vanilla para mantener simplicidad y facilidad de despliegue en XAMPP.
- **API simple basada en PHP**: Endpoints que responden JSON.
- **Sesiones PHP** para autenticación del administrador y clientes.
- **Carrito en el cliente** (localStorage / memoria) hasta el momento de confirmar el pedido.
- **WhatsApp Cloud API** para envío de mensajes promocionales (configuración en `config.php`).

## Diagrama de alto nivel de componentes

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────┐
│  index.html     │     │  admin.html      │     │  login/reg  │
│  script.js      │     │  admin.js        │     │             │
└────────┬────────┘     └────────┬─────────┘     └──────┬──────┘
         │                       │                      │
         └───────────────────────┼──────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │     API PHP (api/)      │
                    │  auth | products |      │
                    │  orders | promotions    │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   MySQL (guayaba_clara) │
                    └─────────────────────────┘
```
