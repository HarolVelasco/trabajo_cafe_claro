# Requisitos Funcionales – Guayaba Clara

## RF-01: Catálogo de productos
El sistema debe mostrar un catálogo de productos de café con nombre, descripción, precio, imagen y disponibilidad de stock.

## RF-02: Carrito de compras
El usuario puede agregar productos al carrito, modificar cantidades y ver el total.

## RF-03: Realización de pedidos
El sistema debe permitir confirmar un pedido asociándolo a un cliente (registrado o no) y guardar los detalles (productos, cantidades, precios).

## RF-04: Registro de usuarios
Los clientes pueden crear una cuenta con nombre, correo, teléfono (WhatsApp) y contraseña.

## RF-05: Inicio de sesión
Los usuarios pueden autenticarse. El sistema diferencia roles: `cliente` y `administrador`.

## RF-06: Historial de pedidos del cliente
Un cliente autenticado puede consultar sus pedidos anteriores.

## RF-07: Panel de administración
El administrador puede:
- Ver y gestionar productos (CRUD + stock)
- Ver y cambiar estado de pedidos
- Ver métricas básicas
- Crear y gestionar promociones

## RF-08: Gestión de inventario
El sistema debe descontar stock al confirmar un pedido y alertar cuando el stock esté por debajo del mínimo.

## RF-09: Promociones por WhatsApp
El administrador puede crear mensajes promocionales y enviarlos a los clientes registrados que tengan número de teléfono.

## RF-10: Validaciones
- Correo único
- Contraseña mínima de 8 caracteres
- Cantidades positivas y no superiores al stock disponible
- Campos obligatorios en formularios de pedido y registro
