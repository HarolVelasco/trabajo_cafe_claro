# Casos de Uso – Guayaba Clara

## Actores
- **Cliente (visitante o registrado)**
- **Administrador**
- **Sistema**

---

### CU-01: Ver catálogo de productos
**Actor:** Cliente  
**Flujo básico:**  
1. El cliente accede a la página principal.  
2. El sistema muestra los productos activos con su información.  
3. El cliente puede filtrar o navegar por categorías.

---

### CU-02: Agregar productos al carrito
**Actor:** Cliente  
**Flujo básico:**  
1. El cliente selecciona un producto y cantidad.  
2. El sistema valida stock disponible.  
3. Agrega el ítem al carrito (localStorage / memoria).  
4. Actualiza el total del carrito.

---

### CU-03: Realizar pedido
**Actor:** Cliente  
**Flujo básico:**  
1. El cliente revisa el carrito y confirma.  
2. Ingresa o confirma datos (nombre, correo, necesidad).  
3. El sistema valida datos y stock.  
4. Guarda el pedido y detalles en la base de datos.  
5. Descuenta stock.  
6. Muestra confirmación.

---

### CU-04: Registrarse
**Actor:** Cliente  
**Flujo básico:**  
1. El cliente completa el formulario de registro.  
2. El sistema valida correo único y contraseña.  
3. Crea el usuario con rol `cliente`.  
4. Inicia sesión automáticamente o redirige al login.

---

### CU-05: Iniciar sesión
**Actor:** Cliente / Administrador  
**Flujo básico:**  
1. Ingresa correo y contraseña.  
2. El sistema verifica credenciales.  
3. Crea sesión y muestra opciones según el rol.

---

### CU-06: Consultar mis pedidos
**Actor:** Cliente autenticado  
**Flujo básico:**  
1. El cliente solicita su historial.  
2. El sistema muestra los pedidos asociados a su usuario.

---

### CU-07: Gestionar productos (CRUD)
**Actor:** Administrador  
**Flujo básico:**  
1. Accede al panel admin.  
2. Puede crear, editar, activar/desactivar productos y ajustar stock.

---

### CU-08: Gestionar pedidos
**Actor:** Administrador  
**Flujo básico:**  
1. Ve listado de pedidos.  
2. Puede cambiar el estado (recibido → en revisión → confirmado / cancelado).

---

### CU-09: Crear y enviar promoción por WhatsApp
**Actor:** Administrador  
**Flujo básico:**  
1. Crea un mensaje promocional.  
2. El sistema lo guarda y opcionalmente lo envía a los clientes con teléfono registrado (usando Meta WhatsApp Cloud API).
