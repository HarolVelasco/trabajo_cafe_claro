# Plan de Pruebas – Guayaba Clara

## Objetivo
Verificar que el sistema cumple los requisitos funcionales y no funcionales definidos para el negocio de café.

## Tipos de prueba

### 1. Pruebas unitarias / de componente (manuales)
- Validación de formularios (correo, contraseña, cantidades).
- Cálculo de totales del carrito.
- Hash y verificación de contraseñas.

### 2. Pruebas de integración
- Flujo completo de registro → login → pedido.
- Creación de pedido y descuento de stock.
- Cambio de estado de pedido desde el panel admin.
- Envío de promoción (si hay credenciales de WhatsApp configuradas).

### 3. Pruebas de sistema / aceptación
| ID     | Caso de prueba                              | Resultado esperado                          |
|--------|---------------------------------------------|---------------------------------------------|
| PT-01  | Registrar un nuevo cliente                  | Usuario creado con rol cliente              |
| PT-02  | Iniciar sesión como cliente                 | Sesión activa y acceso a “Mis pedidos”      |
| PT-03  | Agregar productos al carrito y confirmar    | Pedido guardado y stock descontado          |
| PT-04  | Intentar comprar más de lo disponible       | Mensaje de error / no permite               |
| PT-05  | Acceder a admin.html sin ser administrador  | Acceso denegado                             |
| PT-06  | Crear / editar producto desde admin         | Producto visible en el catálogo             |
| PT-07  | Cambiar estado de un pedido                 | Estado actualizado correctamente            |
| PT-08  | Crear promoción                             | Registro guardado en tabla promociones      |

### 4. Pruebas de usabilidad
- Navegación en móvil y escritorio.
- Claridad de mensajes de error y éxito.

### 5. Pruebas de seguridad básicas
- No se puede acceder al panel admin sin sesión válida.
- Las contraseñas no se almacenan en texto plano.
- Intentos de inyección SQL en formularios no deben tener éxito.

## Criterios de aceptación
- Todos los casos PT-01 a PT-08 pasan correctamente.
- No hay errores críticos en consola del navegador ni en logs de PHP al ejecutar los flujos principales.
- El sistema funciona correctamente bajo XAMPP (Apache + MySQL).
