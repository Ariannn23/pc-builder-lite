# DOCUMENTACIÓN MAESTRA: PC BUILDER LITE

**Fecha de Actualización:** 21 de Enero de 2026
**Versión:** 1.1 (Fase de Desarrollo Frontend)
**Desarrollador:** [Tu Nombre/Arian]

---

## 1. FICHA DEL PROYECTO (PROJECT CHARTER)

### 1.1 Resumen Ejecutivo

PC Builder Lite es una aplicación web "Full Stack" diseñada para asistir a usuarios en la configuración de computadoras personalizadas. Su núcleo es un motor de validación que impide errores de compatibilidad de hardware (Socket, RAM, Potencia) en tiempo real, gestionando datos complejos a través de una arquitectura moderna.

### 1.2 Arquitectura Técnica

- **Frontend:** Next.js 14+ (App Router).
- **Estilos:** Tailwind CSS.
- **Estado Global:** Zustand (Gestión de carrito y lógica de cliente).
- **Base de Datos:** PostgreSQL (vía Supabase).
- **ORM:** Prisma (v5.22.0) para modelado y consultas.
- **Infraestructura de Conexión:**
  - _App:_ Pooler Mode (Puerto 6543) para alto rendimiento.
  - _Migraciones:_ Direct Connection (Puerto 5432) para cambios de esquema.

### 1.3 Estructura de Directorios (Actual)

El proyecto sigue una estructura plana en la raíz (sin carpeta `src`):

```text
pc-builder-lite/
├── app/                  # Rutas y Vistas (Next.js App Router)
│   ├── page.tsx          # Página principal (Catálogo + Resumen)
│   └── layout.tsx        # Layout global
├── components/           # Componentes de UI
│   ├── BuildSummary.tsx  # Panel de resumen (Cliente)
│   └── ProductCard.tsx   # (Pendiente) Tarjeta interactiva
├── lib/                  # Lógica de Backend y Configuración
│   ├── prisma.ts         # Singleton del Cliente Prisma
│   └── data.ts           # Funciones de acceso a datos (DAL)
├── prisma/               # Capa de Base de Datos
│   ├── schema.prisma     # Definición de Tablas
│   └── seed.ts           # Script de datos iniciales
├── public/               # Imágenes estáticas
├── store/                # Estado Global
│   └── useBuilder.ts     # Store de Zustand (Lógica de carrito)
└── docs/                 # Documentación del proyecto
```

## 2. PLAN DE TRABAJO (ROADMAP)

Estado actual: **FASE 3 (EN PROGRESO)**

### Fase 0: Definición y Análisis (✅ COMPLETADO)

- [x] Selección del Stack Tecnológico.
- [x] Definición de Reglas de Negocio.
- [x] Diseño del Modelo Entidad-Relación (DER).

### Fase 1: Infraestructura de Datos (✅ COMPLETADO)

- [x] Setup de Next.js y Tailwind.
- [x] Configuración de Supabase (PostgreSQL).
- [x] Configuración de Prisma y variables de entorno (`.env`).
- [x] Migración de Base de Datos (Creación de tablas).
- [x] Seeding (Carga de datos de prueba: Intel, AMD, etc.).

### Fase 2: API y Acceso a Datos (✅ COMPLETADO)

- [x] Configuración del Singleton (`lib/prisma.ts`).
- [x] Funciones de lectura de datos (`lib/data.ts`).
- [x] Validación de conexión en Server Components.

### Fase 3: Frontend Core & Estado (🚧 EN PROGRESO)

- [x] Instalación de Zustand.
- [x] Creación del Store (`useBuilder.ts`).
- [x] Diseño del Panel de Resumen (`BuildSummary.tsx`).
- [ ] **Siguiente:** Crear componente `ProductCard.tsx`.
- [ ] Integración de botones "Agregar" con el Store.

### Fase 4: Integración de Reglas de Negocio (PENDIENTE)

- [ ] Filtro dinámico: Al elegir CPU, filtrar Motherboards por Socket.
- [ ] Filtro dinámico: Al elegir Motherboard, filtrar RAM por Tipo (DDR4/5).
- [ ] Validación de Energía: Alerta si Watts Totales > Fuente de Poder.

---

## 3. REGLAS DE NEGOCIO (LOGICA DE COMPATIBILIDAD)

Estas reglas dictan cómo debe comportarse el filtrado de productos en la interfaz.

### Regla A: El Corazón (CPU ↔ Motherboard)

- **Concepto:** El procesador debe encajar físicamente en la placa.
- **Condición:** `CPU.socketId` === `Motherboard.compatibleSocketId`.
- **Comportamiento UI:** Cuando el usuario selecciona una CPU, la lista de Motherboards debe recargarse mostrando _solo_ las que coincidan con ese socket.

### Regla B: La Memoria (Motherboard ↔ RAM)

- **Concepto:** La tecnología de memoria debe ser soportada por la placa.
- **Condición:** `Motherboard.memoryType` === `RAM.memoryType`.
- **Comportamiento UI:**
  - Si la Placa es DDR4, ocultar todas las RAMs DDR5.
  - Si la Placa es DDR5, ocultar todas las RAMs DDR4.

### Regla C: Energía (Consumo Total ↔ PSU)

- **Concepto:** La fuente debe tener capacidad suficiente para el pico de consumo.
- **Fórmula:** `ConsumoEstimado` = SUMA(Componentes.powerWatts).
- **Condición:** `PSU.powerWatts` >= `ConsumoEstimado`.
- **Comportamiento UI:** Mostrar el consumo total en rojo o una advertencia si supera la capacidad de la fuente seleccionada.

### Regla D: Integridad del Ensamble

- **Reset en Cascada:** Si el usuario cambia la CPU (ej: de Intel a AMD), el sistema debe limpiar automáticamente la selección de Motherboard actual, ya que es físicamente imposible que sea compatible.
