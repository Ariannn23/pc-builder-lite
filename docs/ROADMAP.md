# Roadmap de Desarrollo: PC Builder Lite 2.0

Este documento define la hoja de ruta para evolucionar la aplicación hacia una plataforma profesional de armado de PCs.

## 🟢 Fase 1: Core & Usuarios (Prioridad Alta)

> Implementar la base para que los usuarios existan y puedan gestionar sus creaciones.

- [x] **Sistema de Autenticación**
  - [x] Registro e Inicio de Sesión (Email/Password + Google).
  - [x] Perfil de Usuario.
  - [x] Asociación de Builds guardados al usuario conectado.
- [ ] **Historial de Builds**
  - [ ] Vista "Mis Armados".
  - [ ] Posibilidad de editar o eliminar builds guardados.

## 🟡 Fase 2: Ingeniería y Lógica de Negocio

> Hacer que el "Builder" sea inteligente y prevenga errores.

- [ ] **Motor de Compatibilidad (Rules Engine)**
  - [ ] Validar Socket CPU vs Motherboard.
  - [ ] Validar Tipo de RAM (DDR4/DDR5) vs Motherboard.
  - [ ] Validar Longitud de GPU vs Gabinete.
- [ ] **Gestión de Energía**
  - [ ] Cálculo automático de TDP total.
  - [ ] Recomendación de PSU basada en TDP + 20% margen.
- [ ] **Control de Stock**
  - [ ] Campo `stock` en base de datos.
  - [ ] UI visual para "Agotado".
  - [ ] Prevenir selección de items sin stock.

## 🔵 Fase 3: Experiencia de Usuario Avanzada

> Mejorar la usabilidad y personalización.

- [ ] **Filtros Avanzados**
  - [ ] Filtrar por Marca, Precio, Color, RGB.
  - [ ] Buscador de texto rápido en componentes.
- [ ] **Modo Asistido (Wizard)**
  - [ ] Cuestionario: "¿Para qué usarás la PC?" (Gaming, Oficina, Render).
  - [ ] Sugerencia de presupuesto base.
- [ ] **Sistema de Reseñas**
  - [ ] Estrellas y comentarios en productos.

## 🟣 Fase 4: Herramientas Sociales

> Fomentar que la gente comparta su contenido.

- [ ] **Comparador Side-by-Side**
  - [ ] Seleccionar 2 builds y ver diferencias de FPS/Precio.
- [ ] **Exportación**
  - [ ] Generar PDF con la cotización.
  - [ ] "Copiar lista para Amazon/Tienda".

## 🔴 Fase 5: Escalabilidad y DevOps

> Preparar el sistema para tráfico real.

- [ ] **Optimización**
  - [ ] Implementar Caché (Redis) para catálogo de productos.
  - [ ] Optimización de imágenes (CDN).
- [ ] **Testing**
  - [ ] Tests unitarios (Vitest/Jest) para la lógica de compatibilidad.
  - [ ] Tests E2E (Playwright) para el flujo de compra.

---

## 📅 Pasos Siguientes Inmediatos

Comenzaremos por la **Fase 1: Autenticación**, ya que es el requisito previo para guardar historiales y perfiles.
