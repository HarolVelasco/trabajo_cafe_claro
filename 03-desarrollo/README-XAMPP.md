# Café Claro + XAMPP

## Instalacion local

1. Instala y abre XAMPP.
2. Enciende los servicios **Apache** y **MySQL**.
3. Copia esta carpeta dentro de `C:\xampp\htdocs\guayaba-clara`.
4. Abre `http://localhost/phpmyadmin`.
5. Selecciona la pestaña **Importar**, elige `database.sql` y ejecuta la importacion.
6. Abre `http://localhost/guayaba-clara/`.

La configuracion por defecto usa:

- Host: `127.0.0.1`
- Base de datos: `guayaba_clara`
- Usuario: `root`
- Contraseña: vacia

Si tu instalacion de XAMPP tiene contraseña para MySQL, actualiza `api/config.php` antes de probar el formulario.

## Promociones por WhatsApp

El administrador puede crear promociones desde `admin.html`. Para activar los envios, crea una app de WhatsApp Cloud API en Meta y coloca en `api/config.php` el token permanente y el ID del numero:

Si ya tenias la base de datos instalada, ejecuta primero en phpMyAdmin:

```sql
ALTER TABLE usuarios ADD COLUMN telefono VARCHAR(20) NOT NULL DEFAULT '' AFTER correo;
CREATE TABLE promociones (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	titulo VARCHAR(120) NOT NULL,
	mensaje TEXT NOT NULL,
	activa TINYINT(1) NOT NULL DEFAULT 1,
	creado_por INT UNSIGNED NULL,
	creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

```php
const WHATSAPP_ACCESS_TOKEN = 'tu-token-de-meta';
const WHATSAPP_PHONE_NUMBER_ID = '1234567890';
```

Los clientes deben registrarse con su numero en formato internacional, por ejemplo `+573001234567`. Meta exige una plantilla aprobada para iniciar conversaciones promocionales fuera de la ventana de 24 horas; este endpoint usa mensajes de texto y funciona durante una conversacion abierta. Para envios promocionales iniciados por la empresa, adapta `send_whatsapp()` para enviar el nombre y parametros de tu plantilla aprobada.

## Que se guarda

El formulario envia los datos a `api/order.php`. El endpoint valida el nombre, correo, productos y cantidades, y guarda en una transaccion:

- `clientes`: nombre y correo.
- `pedidos`: necesidad, total, estado y fecha.
- `pedido_detalles`: producto, cantidad y precio aplicado.

No abras `index.html` directamente desde el explorador de archivos: PHP y `fetch()` necesitan Apache para funcionar. El carrito local seguirá funcionando, pero el pedido requiere la URL de XAMPP.

## Sistema empresarial

La aplicación incluye registro e inicio de sesión, roles `cliente` y `administrador`, catálogo y stock desde MySQL, pedidos asociados al usuario, historial y CRUD de productos. Para crear el primer administrador, registra una cuenta y ejecuta en phpMyAdmin:

```sql
UPDATE usuarios SET rol = 'administrador' WHERE correo = 'tu-correo@ejemplo.com';
```

Cierra sesión y vuelve a entrar para que aparezca el panel administrativo. El modelo está en `database.sql` y los endpoints están en `api/auth.php`, `api/products.php`, `api/order.php` y `api/orders.php`.

## Páginas

- `index.html`: página principal, catálogo, carrito y origen.
- `login.html`: inicio de sesión para clientes y administradores.
- `register.html`: registro exclusivo de clientes.
- `admin.html`: panel protegido para administración, inventario y pedidos.
