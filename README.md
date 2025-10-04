# 🛍️ CRUD de Productos - Angular Frontend

Sistema completo de gestión de productos desarrollado en Angular 20 con TypeScript, diseñado para conectar con un backend Spring Boot.

## 📋 Descripción del Proyecto

Este proyecto implementa un sistema CRUD (Create, Read, Update, Delete) para la gestión de productos con las siguientes características:

### ✨ Características Principales

- **🔍 Búsqueda en tiempo real** por nombre de producto
- **📊 Filtrado avanzado** por categoría y nivel de stock
- **📄 Paginación configurable** (5, 10, 25, 50 elementos)
- **🔢 Ordenamiento** por cualquier columna (ascendente/descendente)
- **📝 Formularios reactivos** con validación completa
- **🏷️ Categorías dinámicas** - Escribe nuevas categorías o selecciona existentes
- **🔔 Sistema de notificaciones** tipo toast
- **⚠️ Alertas de stock bajo** con indicadores visuales
- **🎨 Interfaz moderna** y responsiva
- **🔧 Herramientas de diagnóstico** para conexión con backend

### 🛠️ Tecnologías Utilizadas

- **Angular 20** - Framework principal
- **TypeScript 5.9** - Lenguaje de programación
- **RxJS** - Programación reactiva
- **Angular Reactive Forms** - Manejo de formularios
- **HTTP Client** - Comunicación con API REST
- **Karma + Jasmine** - Testing unitario

## 🏗️ Arquitectura del Proyecto

```
src/app/
├── components/                  # Componentes de la aplicación
│   ├── connection-test/         # Herramienta de diagnóstico de conexión
│   ├── notifications/           # Sistema de notificaciones toast
│   ├── producto-form/           # Formulario de creación/edición
│   └── producto-lista-avanzada/ # Vista principal de productos
├── interceptors/                # Interceptores HTTP
│   └── error.interceptor.ts     # Manejo global de errores
├── models/                      # Modelos de datos TypeScript
│   └── producto.model.ts        # Interfaces Producto y ProductoRequest
├── services/                    # Servicios de la aplicación
│   ├── notification.service.ts  # Servicio de notificaciones
│   └── producto.ts              # Servicio principal de productos
└── environments/                # Configuración por ambiente
```

## 🚀 Configuración y Ejecución

### Prerrequisitos

- Node.js (versión 18 o superior)
- Angular CLI (`npm install -g @angular/cli`)
- Backend Spring Boot ejecutándose en `http://localhost:8080`

### Instalación

1. **Clonar el repositorio:**

   ```bash
   git clone <url-del-repositorio>
   cd crud-products-angular
   ```

2. **Instalar dependencias:**

   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo:**

   ```bash
   ng serve
   ```

   La aplicación estará disponible en `http://localhost:4200`

### 🔧 Configuración del Backend

El frontend está configurado para conectar con un backend Spring Boot en:

- **URL Base:** `http://localhost:8080/api/productos`
- **Endpoints esperados:**
  - `GET /api/productos` - Listar productos
  - `GET /api/productos/{id}` - Obtener producto por ID
  - `POST /api/productos` - Crear producto
  - `PUT /api/productos/{id}` - Actualizar producto
  - `DELETE /api/productos/{id}` - Eliminar producto

## 📱 Funcionalidades de la Aplicación

### 🏠 Gestión de Productos

- **Vista principal** con tabla responsive
- **Búsqueda instantánea** por nombre
- **Filtros inteligentes:**
  - Por categoría (dinámicas desde BD)
  - Por nivel de stock (Bajo <5, Medio 5-20, Alto >20)
- **Paginación** con opciones de 5, 10, 25, 50 elementos
- **Ordenamiento** por ID, Nombre, Categoría, Precio, Stock

### ➕ Crear/Editar Productos

- **Formulario reactivo** con validaciones en tiempo real
- **Categorías dinámicas** - Escribe nuevas o selecciona existentes
- **Validaciones:**
  - Nombre: 2-100 caracteres, requerido
  - Categoría: 2-50 caracteres, requerido
  - Precio: 0.01-999,999.99, requerido
  - Stock: 0-999,999, requerido
- **Modo edición** automático al seleccionar producto existente

### 🔔 Sistema de Notificaciones

- **Notificaciones toast** para todas las acciones
- **Diferentes tipos:** éxito, error, advertencia, información
- **Auto-dismiss** configurable
- **Posicionamiento** optimizado

### 🔧 Herramientas de Diagnóstico

- **Test de conexión** con múltiples URLs
- **Análisis detallado** de errores de conectividad
- **Información de estado** del backend

## 🧪 Testing

### Ejecutar pruebas unitarias:

```bash
ng test
```

### Ejecutar pruebas con coverage:

```bash
ng test --code-coverage
```

## 🏗️ Build para Producción

```bash
ng build --configuration production
```

Los archivos de distribución se generarán en el directorio `dist/`.

## 🎨 Características de UI/UX

- **Design System** consistente con Bootstrap-like styles
- **Responsive Design** - Funciona en desktop, tablet y móvil
- **Accesibilidad** - Labels apropiados y navegación por teclado
- **Loading States** - Indicadores durante operaciones asíncronas
- **Error Handling** - Mensajes de error claros y accionables
- **Visual Feedback** - Confirmaciones, alertas y estado de carga

## 🔄 Gestión de Estado

- **Servicios singleton** para manejo centralizado de datos
- **Observables** para comunicación reactiva entre componentes
- **Error interceptors** para manejo global de errores HTTP
- **Retry logic** automático para operaciones fallidas

## 📊 Funcionalidades Avanzadas

### Filtrado Inteligente de Stock:

- **Stock Bajo (<5):** Productos que necesitan reposición
- **Stock Medio (5-20):** Inventario normal
- **Stock Alto (>20):** Productos bien abastecidos

### Categorías Dinámicas:

- **Auto-carga** desde base de datos
- **Autocompletado** con sugerencias
- **Creación dinámica** de nuevas categorías
- **Fallback** a categorías sugeridas si BD está vacía

## 🚨 Manejo de Errores

- **Interceptor global** para errores HTTP
- **Mensajes específicos** por tipo de error (400, 404, 409, 500)
- **Fallback graceful** cuando el backend no está disponible
- **Retry automático** para operaciones críticas

## 👥 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

## 🔗 Enlaces Útiles

- [Angular Documentation](https://angular.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [RxJS Documentation](https://rxjs.dev/)
- [Angular CLI Reference](https://angular.dev/tools/cli)
