# Requisitos No Funcionales – Cafe Claro

## RNF-01: Usabilidad
La interfaz debe ser clara, moderna y usable tanto en escritorio como en dispositivos móviles (diseño responsive).

## RNF-02: Rendimiento
Las páginas principales y las consultas de productos/pedidos deben responder en menos de 2 segundos en un entorno local XAMPP.

## RNF-03: Seguridad
- Las contraseñas deben almacenarse hasheadas (password_hash de PHP).
- Las sesiones deben proteger el acceso al panel de administración.
- Validación de entradas en el backend para evitar inyecciones SQL y XSS básicos.

## RNF-04: Disponibilidad
El sistema está orientado a un entorno local o servidor compartido sencillo (XAMPP / hosting PHP + MySQL).

## RNF-05: Mantenibilidad
Código organizado en frontend (HTML/CSS/JS) y backend (PHP API REST-like). Base de datos normalizada.

## RNF-06: Compatibilidad
Compatible con navegadores modernos (Chrome, Firefox, Edge, Safari). Backend PHP 7.4+ / 8.x y MySQL 5.7+ / MariaDB.

## RNF-07: Escalabilidad (inicial)
Diseñado para un volumen bajo-medio de pedidos (negocio pequeño/mediano). No se contempla alta concurrencia en la primera versión.
