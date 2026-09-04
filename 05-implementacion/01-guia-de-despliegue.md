# Guía de Despliegue – Guayaba Clara (XAMPP)

## Requisitos previos
- XAMPP instalado (Apache + MySQL)
- Navegador moderno

## Pasos de instalación local

1. Copia la carpeta del proyecto dentro de `C:\xampp\htdocs\` (o la ruta equivalente en Linux/Mac) con el nombre `guayaba-clara`.

2. Inicia los servicios **Apache** y **MySQL** desde el panel de control de XAMPP.

3. Abre `http://localhost/phpmyadmin`.

4. Crea la base de datos importando el archivo `database.sql`:
   - Selecciona la pestaña **Importar**
   - Elige el archivo `database.sql`
   - Ejecuta la importación

5. (Opcional) Si tu MySQL tiene contraseña, edita `api/config.php` y coloca las credenciales correctas.

6. Abre el sistema en el navegador:
   ```
   http://localhost/guayaba-clara/
   ```

## Crear el primer administrador

1. Registra una cuenta normal desde la aplicación.
2. En phpMyAdmin ejecuta:
   ```sql
   UPDATE usuarios SET rol = 'administrador' WHERE correo = 'tu-correo@ejemplo.com';
   ```
3. Cierra sesión y vuelve a iniciar sesión. Ahora tendrás acceso al panel de administración (`admin.html`).

## Configuración de WhatsApp (opcional)

1. Crea una aplicación en Meta for Developers y obtén:
   - Access Token permanente
   - Phone Number ID

2. Coloca los valores en `api/config.php`:
   ```php
   const WHATSAPP_ACCESS_TOKEN = 'tu-token';
   const WHATSAPP_PHONE_NUMBER_ID = 'tu-phone-number-id';
   ```

3. Los clientes deben registrarse con número en formato internacional (ej: `+573001234567`).

## Notas importantes
- No abras `index.html` directamente desde el explorador de archivos. Debe servirse a través de Apache.
- El carrito funciona localmente, pero los pedidos requieren el backend PHP.
- Revisa los logs de Apache/PHP si aparecen errores 500.
