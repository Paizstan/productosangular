# CRUD de Productos - Angular Frontend

Sistema completo de gestión de productos desarrollado en Angular con integración a backend Java/Spring Boot y base de datos Oracle.

## 🚀 Características Principales

### Funcionalidades Core (CRUD)

- ✅ **Crear** productos con validaciones completas
- ✅ **Leer** listado de productos con información detallada
- ✅ **Actualizar** productos existentes
- ✅ **Eliminar** productos con confirmación

### Validaciones Frontend y Backend

- ✅ Nombre único y requerido
- ✅ Precio positivo (> 0)
- ✅ Stock no negativo (>= 0)
- ✅ Categoría obligatoria
- ✅ Mensajes de error claros y amigables

### Funcionalidades Avanzadas (Bonus)

- 🎯 **Paginación** configurable (5, 10, 25, 50 elementos)
- 🔍 **Búsqueda** en tiempo real por nombre
- 🏷️ **Filtros** por categoría y nivel de stock
- 📊 **Ordenamiento** por cualquier columna (asc/desc)
- 🎨 **Interfaz responsiva** y moderna
- 🔔 **Sistema de notificaciones** toast
- ⚠️ **Alertas de stock bajo** con indicadores visuales

## 🏗️ Arquitectura del Frontend

### Estructura del Proyecto

```
src/app/
├── components/
│   ├── producto-lista/           # Vista simple de productos
│   ├── producto-lista-avanzada/  # Vista con filtros y paginación
│   ├── producto-form/            # Formulario crear/editar
│   └── notifications/            # Sistema de notificaciones
├── models/
│   └── producto.model.ts         # Interfaces TypeScript
├── services/
│   ├── producto.ts              # Servicio HTTP para productos
│   └── notification.service.ts  # Servicio de notificaciones
├── interceptors/
│   └── error.interceptor.ts     # Manejo global de errores HTTP
└── app.routes.ts                # Configuración de rutas
```

### Tecnologías Utilizadas

- **Angular 20** (Última versión con arquitectura standalone)
- **TypeScript 5.9**
- **RxJS** para programación reactiva
- **Angular Forms** (Reactive Forms)
- **Angular Router** para navegación
- **HTTP Client** para comunicación con API

## 🔧 Instalación y Configuración

### Prerrequisitos

- Node.js 18+ y npm
- Angular CLI 20+

### Configuración del Backend

1. Asegúrate de que tu backend Java esté corriendo en `http://localhost:8080`
2. La API debe tener los endpoints:
   - `GET /productos` - Listar productos
   - `POST /productos` - Crear producto
   - `GET /productos/{id}` - Obtener producto por ID
   - `PUT /productos/{id}` - Actualizar producto
   - `DELETE /productos/{id}` - Eliminar producto

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
