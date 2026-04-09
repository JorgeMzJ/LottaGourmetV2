# Pasteles UPBC - Sistema de Ventas y Pedidos

## Descripción
Sistema web responsivo para gestión de ventas de pasteles, promociones y pedidos personalizados. Incluye soporte para el inicio de sesión de usuarios, un carrito de compras interactivo, generación dinámica de catálogos y un panel administrativo completo con estadísticas en tiempo real. 

Adicionalmente, el sistema se integra con una pasarela de pagos vía **Stripe Checkout**, cuenta con **Geolocalización** para certificar que el cliente se encuentre dentro del área de reparto a domicilio, y ofrece un **Sistema de Citas y Pedidos Dinámico** totalmente accesible (WCAG 2.1 AA) e interactivo con navegación por teclado, descuentos aplicables por volumen y variables de color globales (CSS) que permiten adecuar la temática del sitio eficientemente.

## Tecnologías Utilizadas
- **Backend:** PHP 7.4+ con arquitectura MVC.
- **Base de Datos:** MySQL 5.7+ (Consultas preparadas con PDO).
- **Frontend:** HTML5, CSS3 Nativo (Variables CSS globales estandarizadas), JavaScript Vanilla (sin jQuery).
- **Pagos:** API REST de Stripe Checkout.
- **Entorno Local:** XAMPP (Apache + MySQL).

---

## 📂 Estructura del Proyecto

```text
PastelesUPBC/
├── Config/            # Archivos de configuración (Database, App, Constantes)
├── Controller/        # Controladores que enlazan Modelos con Vistas
├── Model/             # Modelos de datos y reglas de negocio
├── Public/            # Recursos y elementos visuales estáticos
│   ├── css/           # Estilos (Hojas en cascada)
│   ├── js/            # Interacciones y peticiones asíncronas
│   └── img/           # Banco de imágenes SVG, PNG, WebP
├── View/              # Vistas al usuario
│   ├── paginas/       # Páginas principales del flujo web
│   └── plantillas/    # Header, footer, modales y sidebar global
├── pastelesupbc.sql   # Script de la base de datos MySQL
└── index.php          # Enrutador principal de la aplicación (Front Controller)
```

---

## ⚙️ Configuración e Instalación

### 1. Preparar el Entorno
1. Clona, descarga o mueve esta carpeta hasta que quede alojada justo en `C:\xampp\htdocs\PastelesUPBC`.
2. Renombra la carpeta a `PastelesUPBC` (si no se llama así) para evitar inconsistencias con las rutas base por defecto.

### 2. Base de Datos
1. Abre el panel de control de **XAMPP** e inicia de manera simultánea `Apache` y `MySQL`.
2. Ve a [http://localhost/phpmyadmin](http://localhost/phpmyadmin).
3. Crea una base de datos nueva llamada `pastelesupbc`.
4. Importa en esa base de datos recién creada el script SQL de respaldo provisto con el proyecto (`pastelesupbc.sql`).

### 3. Conexiones a la BD (Database.php)
Debes verificar que el entorno coincida dentro del archivo `Config/Database.php`. La clase `Database` maneja la conexión. Tienes dos plantillas en caso de subir este desarrollo a producción:

**Para tu Máquina Local (XAMPP):**
```php
<?php
class Database {
    private $host = "localhost";
    private $db_name = "pastelesupbc";
    private $username = "root";
    private $password = "";
    public $conn;

    public function getConnection() { /* ... PDO connection ... */ }
}
?>
```

**Para Despliegue en Producción:**
```php
<?php
class Database {
    private $host = "produccion.host.com";
    private $db_name = "sql_pastelesupbc";
    private $username = "user_bd";
    private $password = "password_bd";
    /* ... */
}
?>
```
*Si tienes constantes de credenciales para Stripe u otras integraciones, debes definirlas oportunamente en el `Config/App.php` o similar.*

---

## 👥 Credenciales de Prueba

**👤 Perfil Cliente:**
- **Email:** `usuario@ejemplo.com`
- **Password:** No asignado (el administrador restringe acceso o crea uno nuevo de prueba).
- *Nota: El registro a nuevos clientes permite el ingreso de números de teléfono internacionales soportando el signo "+" (Ej: +52).*

**🛡️ Perfil Administrador:**
- **Email:** `admin@gmail.com`
- **Password:** `admin1`
- **Capacidades:** Permisos para la gestión transversal de productos, revisiones de compras y restock.

---

## 💡 Funcionalidades Destacadas

### Panel del Cliente:
- **Catálogo Dinámico:** Permite explorar y filtrar postres, y buscar por promociones activas (los precios con descuento aplicados se muestran de color acentuado asignado desde `:root` en CSS global).
- **Carrito Persistente:** Se guarda en el `localStorage` del navegador para evitar su desaparición durante las transiciones de página y realiza una lógica robusta para checar que no se supere el stock existente.
- **Menú de Productos Dinámico (Citas):** El sistema de citas fue modernizado, reemplazando paquetes preestablecidos por un menú de productos interactivo. Incluye soporte de pago directo redirigiendo de forma segura hacia la plataforma de Stripe.
- **Accesibilidad y Descuentos por Alto Volumen:** El sistema de compra personalizada cumple las normas de accesibilidad de contraste WCAG 2.1 AA. Cuenta con soporte de teclado para navegación de modales y en adición, se contemplan cálculos automáticos de descuento por volumen de compra alta (utilizando controles numéricos accesibles).
- **Mis Pedidos:** Historial de compras estable y unificado en la base de datos. En esta sección el cliente visualiza sus transacciones pagadas exitosamente (sincronizado a través del flujo sin cortes con Stripe o confirmaciones internas).

### Panel de Administración:
- **Operaciones de Productos:** Tablero para activar descuentos de temporada, subir o sustituir nuevas imágenes a la galería y modificar especificaciones.
- **Restock Masivo:** Opción que le permite al administrador aportar existencias generales a todos los productos del catálogo al usar una acción rápida de backend.
- **Dashboard Estadístico:** Gráficas visuales (Chart.js) que se alimentan de la actividad asíncrona dentro de la BD para trazar el comportamiento.

---

## 🛡️ Características de Seguridad y Rendimiento
- **Protección de Rutas:** Se verifican los privilegios de sesión en los constructores de cada vista para impedir cualquier intrusión del público.
- **Escapes Visuales:** Toda vista de usuario escapa cadenas insertadas provenientes del HTML usando iteraciones seguras (p.ej. `htmlspecialchars()`).
- **Integridad de las Transacciones (ACID):** Todo movimiento monetario o de alteración de inventario con base de datos cuenta con una iniciación estructurada (`beginTransaction()`) y control preciso (`commit()` y `rollBack()`).

---
**Última actualización:** Abril de 2026.
**Versión:** 2.0
