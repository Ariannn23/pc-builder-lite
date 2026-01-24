# Roadmap: E-commerce sin Costos de Producción

**Objetivo:** Construir una arquitectura completa de e-commerce manteniendo $0 en costos de producción.  
**Estrategia:** Implementar todos los módulos con mocks/simulaciones, dejando las integraciones reales para el final.

---

## 🎯 Filosofía del Proyecto

### ✅ Lo que SÍ haremos AHORA (Gratis)

- Sistema de carrito completo
- Checkout flow (sin pago real)
- Gestión de órdenes simuladas
- Dashboard de administración
- Control de inventario
- Sistema de emails (mock o free tier de Resend)
- Estados de orden completos
- Toda la UX/UI de e-commerce

### ❌ Lo que dejamos para EL FINAL (Cuando haya revenue)

- Integración real de Stripe
- Emails transaccionales de producción (más allá de free tier)
- Servicios de logística pagos
- Analytics premium

---

## 🗺️ Roadmap por Fases (0 Costo)

### **FASE 1: Sistema de Carrito** (Semana 1)

**Objetivo:** Separar "Builds" de "Carrito" y crear experiencia de shopping cart

#### 1.1 Modelo de Datos

```prisma
model Cart {
  id        String     @id @default(uuid())
  userId    String?
  user      User?      @relation(fields: [userId], references: [id])
  cartItems CartItem[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  // Para carritos de invitados (no logueados)
  sessionId String?    @unique
}

model CartItem {
  id        String  @id @default(uuid())
  cartId    String
  cart      Cart    @relation(fields: [cartId], references: [id], onDelete: Cascade)
  productId String
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int     @default(1)

  @@unique([cartId, productId])
}
```

#### 1.2 Componentes UI

- `<CartButton />` - Badge con contador en navbar
- `<CartDrawer />` - Drawer lateral con resumen
- `<CartItem />` - Item individual editable
- `<CartSummary />` - Subtotal, impuestos, total

#### 1.3 Lógica de Negocio

- Zustand store para carrito (`useCartStore`)
- Persistencia en localStorage
- Sincronización con DB al login
- Merge de carrito invitado → usuario

**Entregables:**

- ✅ Schema de Cart en Prisma
- ✅ Zustand store funcional
- ✅ UI de carrito completa
- ✅ "Agregar al carrito" en ProductCard

---

### **FASE 2: Checkout Flow (Sin Pago)** (Semana 2)

**Objetivo:** Crear todo el proceso de checkout, marcando el paso de pago como "Simulado"

#### 2.1 Páginas

```
/checkout
  /shipping    → Dirección de envío
  /payment     → Método de pago (SIMULADO)
  /review      → Revisión final
  /confirmation → Orden creada
```

#### 2.2 Componentes

- `<CheckoutStepper />` - Indicador de pasos
- `<ShippingForm />` - Formulario de dirección con validación
- `<PaymentMethodMock />` - Selector de método (para arquitectura)
- `<OrderSummary />` - Resumen de orden
- `<OrderConfirmation />` - Pantalla de éxito

#### 2.3 Simulación de Pago

```typescript
// Mock de pasarela de pago
async function processPaymentMock(orderData) {
  // Simular 2 segundos de procesamiento
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // 95% de éxito, 5% de fallo (para testing)
  const success = Math.random() > 0.05;

  return {
    success,
    transactionId: `MOCK-${Date.now()}`,
    message: success
      ? "Pago procesado (simulado)"
      : "Pago rechazado (simulado)",
  };
}
```

**Entregables:**

- ✅ Flujo completo de 4 pasos
- ✅ Validación de dirección
- ✅ Mock de procesamiento de pago
- ✅ Creación de orden en DB

---

### **FASE 3: Sistema de Órdenes** (Semana 3)

**Objetivo:** Gestionar órdenes completas con estados del ciclo de vida

#### 3.1 Modelo de Datos

```prisma
model Order {
  id            String      @id @default(uuid())
  orderNumber   String      @unique // ORD-20260124-001
  userId        String
  user          User        @relation(fields: [userId], references: [id])

  // Información de compra
  subtotal      Float
  tax           Float
  shippingCost  Float
  total         Float

  // Dirección
  shippingAddress Json      // { street, city, state, zip, country }
  billingAddress  Json?

  // Estado y tracking
  status        OrderStatus @default(PENDING)
  paymentStatus PaymentStatus @default(PENDING)
  paymentMethod String?     // "credit_card", "paypal", etc.
  transactionId String?     // ID de la pasarela (mock por ahora)

  // Fechas
  createdAt     DateTime    @default(now())
  paidAt        DateTime?
  shippedAt     DateTime?
  deliveredAt   DateTime?
  cancelledAt   DateTime?

  orderItems    OrderItem[]

  @@index([userId])
  @@index([status])
}

model OrderItem {
  id          String  @id @default(uuid())
  orderId     String
  order       Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId   String
  product     Product @relation(fields: [productId], references: [id])

  quantity    Int
  unitPrice   Float   // Precio al momento de la compra
  subtotal    Float   // quantity * unitPrice

  @@index([orderId])
}

enum OrderStatus {
  PENDING       // Orden creada, esperando pago
  PAID          // Pago confirmado
  PROCESSING    // Preparando envío
  SHIPPED       // Enviado
  DELIVERED     // Entregado
  CANCELLED     // Cancelado
  REFUNDED      // Reembolsado
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}
```

#### 3.2 Páginas

- `/orders` - Lista de órdenes del usuario
- `/orders/[id]` - Detalle de orden individual
- `/orders/[id]/track` - Tracking de envío (mock)

#### 3.3 Server Actions

```typescript
// app/orders/actions.ts
export async function createOrder(checkoutData) {
  // 1. Validar carrito
  // 2. Crear orden en DB
  // 3. Reducir stock (optimistic)
  // 4. Limpiar carrito
  // 5. Enviar email (mock)
  // 6. Retornar orderNumber
}

export async function getOrders(userId) {
  // Obtener todas las órdenes del usuario
}

export async function updateOrderStatus(orderId, newStatus) {
  // Admin only - Cambiar estado de orden
}
```

**Entregables:**

- ✅ Schema completo de órdenes
- ✅ Página "Mis Órdenes"
- ✅ Vista detallada de orden
- ✅ Estados de orden funcionales

---

### **FASE 4: Dashboard de Administración** (Semana 4-5)

**Objetivo:** Panel completo para gestionar el e-commerce

#### 4.1 Estructura

```
/admin
  /dashboard      → Overview con estadísticas
  /products       → CRUD de productos
  /orders         → Gestión de órdenes
  /customers      → Lista de clientes
  /inventory      → Control de stock
  /settings       → Configuraciones
```

#### 4.2 Componentes de Dashboard

- `<StatsCard />` - Ventas, órdenes, clientes
- `<SalesChart />` - Gráfica de ventas (recharts - gratis)
- `<RecentOrders />` - Últimas órdenes
- `<LowStockAlerts />` - Productos con bajo stock

#### 4.3 Gestión de Productos

- CRUD completo de productos
- Upload de imágenes (Supabase storage gratis)
- Edición bulk
- Categorías y etiquetas

#### 4.4 Gestión de Órdenes

- Filtros por estado
- Búsqueda por número de orden
- Cambio de estado manual
- Impresión de "factura" (PDF con react-pdf - gratis)

**Entregables:**

- ✅ Dashboard funcional
- ✅ CRUD de productos
- ✅ Gestión de órdenes admin
- ✅ Control de inventario

---

### **FASE 5: Sistema de Notificaciones (Mock)** (Semana 6)

**Objetivo:** Arquitectura de emails sin costos

#### 5.1 Estrategia Sin Costos

```typescript
// utils/email-service.ts
export class EmailService {
  static async sendOrderConfirmation(order: Order) {
    if (process.env.NODE_ENV === 'production' && process.env.RESEND_KEY) {
      // Usar Resend free tier (100 emails/día)
      return await resend.emails.send({...});
    } else {
      // Modo desarrollo: solo console.log
      console.log('📧 Email Mock - Order Confirmation:', {
        to: order.user.email,
        orderNumber: order.orderNumber,
        total: order.total
      });
      return { success: true, mock: true };
    }
  }
}
```

#### 5.2 Templates de Email (React Email - Gratis)

```tsx
// emails/OrderConfirmation.tsx
export default function OrderConfirmationEmail({ order }) {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Heading>¡Gracias por tu compra!</Heading>
          <Text>Tu orden #{order.orderNumber} ha sido confirmada.</Text>
          {/* Template completo */}
        </Container>
      </Body>
    </Html>
  );
}
```

#### 5.3 Tipos de Emails

- Confirmación de orden
- Orden enviada
- Orden entregada
- Cancelación de orden
- Bienvenida (nuevo usuario)

**Entregables:**

- ✅ EmailService con modo mock
- ✅ Templates profesionales con React Email
- ✅ Integración opcional con Resend free tier
- ✅ Preview de emails en `/admin/emails`

---

### **FASE 6: Features Avanzadas** (Semana 7-8)

**Objetivo:** Completar la experiencia de e-commerce

#### 6.1 Sistema de Cupones

```prisma
model Coupon {
  id          String   @id @default(uuid())
  code        String   @unique
  type        CouponType
  value       Float    // Porcentaje o cantidad fija
  minPurchase Float?
  maxDiscount Float?
  startDate   DateTime
  endDate     DateTime
  usageLimit  Int?
  usageCount  Int      @default(0)
  isActive    Boolean  @default(true)
}

enum CouponType {
  PERCENTAGE
  FIXED_AMOUNT
}
```

#### 6.2 Lista de Deseos

```prisma
model Wishlist {
  id        String         @id @default(uuid())
  userId    String         @unique
  user      User           @relation(fields: [userId], references: [id])
  items     WishlistItem[]
}
```

#### 6.3 Comparador de Productos

- Página `/compare` para comparar specs lado a lado
- Máximo 4 productos
- Tabla comparativa visual

#### 6.4 Búsqueda Avanzada

- Búsqueda con autocompletado
- Filtros múltiples
- Ordenamiento por relevancia, precio, etc.

**Entregables:**

- ✅ Sistema de cupones funcional
- ✅ Wishlist/favoritos
- ✅ Comparador de productos
- ✅ Búsqueda avanzada

---

## 🛠️ Stack Tecnológico (Todo Gratis)

### Core (Ya tienen)

- ✅ Next.js 16
- ✅ Prisma + PostgreSQL (Supabase free tier)
- ✅ NextAuth
- ✅ Tailwind CSS

### Nuevas Dependencias (Todas Gratis)

```json
{
  "dependencies": {
    "zustand": "^4.5.0", // State management para carrito
    "@react-email/components": "^0.0.15", // Templates de email
    "react-pdf": "^7.7.0", // Generar facturas PDF
    "recharts": "^2.12.0", // Gráficas de ventas
    "react-hook-form": "^7.50.0", // Ya lo tienen
    "date-fns": "^3.3.0", // Manejo de fechas
    "@tanstack/react-table": "^8.11.0" // Tablas admin
  },
  "devDependencies": {
    "resend": "^3.2.0" // Free tier: 100 emails/día
  }
}
```

### Servicios Gratuitos

| Servicio        | Free Tier              | Uso                      |
| --------------- | ---------------------- | ------------------------ |
| **Supabase**    | 500MB DB + 1GB storage | Base de datos + imágenes |
| **Vercel**      | Ilimitado para hobby   | Hosting                  |
| **Resend**      | 100 emails/día         | Emails transaccionales   |
| **React Email** | Gratis                 | Templates de email       |

---

## 📅 Timeline Completo

| Semana  | Módulo             | Deliverables                    |
| ------- | ------------------ | ------------------------------- |
| **1**   | Sistema de Carrito | Cart store, UI, persistencia    |
| **2**   | Checkout Flow      | 4 pasos, mock de pago           |
| **3**   | Órdenes            | Schema, páginas, estados        |
| **4-5** | Admin Dashboard    | CRUD productos, gestión órdenes |
| **6**   | Emails Mock        | Templates, EmailService         |
| **7-8** | Features Avanzadas | Cupones, wishlist, búsqueda     |

**Total:** 8 semanas con $0 de costo

---

## 🎯 Arquitectura Final (Sin Pagos Reales)

```
┌─────────────────────────────────────────┐
│         FRONTEND (Next.js)              │
├─────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐            │
│  │ Builder  │  │  Cart    │            │
│  └──────────┘  └──────────┘            │
│  ┌──────────────────────────────────┐  │
│  │      Checkout (Mock Payment)     │  │
│  └──────────────────────────────────┘  │
│  ┌──────────┐  ┌──────────────────┐   │
│  │ Orders   │  │  Admin Dashboard │   │
│  └──────────┘  └──────────────────┘   │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│        BACKEND (Server Actions)         │
├─────────────────────────────────────────┤
│  Cart Logic  │  Order Service           │
│  Email Mock  │  Inventory Control       │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│      DATABASE (Supabase Postgres)       │
├─────────────────────────────────────────┤
│  Cart  │  Order  │  Product  │  User   │
└─────────────────────────────────────────┘
```

---

## 🚀 Plan de Migración a Producción (Cuando estén listos)

### Paso 1: Activar Pasarela Real

```diff
// checkout/payment/actions.ts
- const result = await processPaymentMock(orderData);
+ const result = await stripe.paymentIntents.create({...});
```

### Paso 2: Emails Reales

```diff
// utils/email-service.ts
- if (process.env.NODE_ENV === 'production' && process.env.RESEND_KEY) {
+ if (process.env.RESEND_KEY) { // Siempre usar Resend
```

### Paso 3: Configurar Webhooks

- Stripe webhook para confirmar pagos
- Actualizar estados de orden automáticamente

**Tiempo de migración:** 2-3 días

---

## ✅ Checklist de Implementación

### Fase 1: Carrito ✓

- [ ] Schema Cart + CartItem en Prisma
- [ ] Zustand store `useCartStore`
- [ ] CartDrawer component
- [ ] CartButton con badge
- [ ] Persistencia en localStorage
- [ ] Sincronización al login

### Fase 2: Checkout ✓

- [ ] Páginas /checkout/\*
- [ ] ShippingForm con validación
- [ ] Mock de procesamiento de pago
- [ ] OrderSummary component
- [ ] Confirmación de orden

### Fase 3: Órdenes ✓

- [ ] Schema Order + OrderItem
- [ ] Página /orders
- [ ] Página /orders/[id]
- [ ] Estados de orden
- [ ] Filtros y búsqueda

### Fase 4: Admin ✓

- [ ] Layout de admin protegido
- [ ] Dashboard con stats
- [ ] CRUD de productos
- [ ] Gestión de órdenes
- [ ] Control de inventario

### Fase 5: Emails ✓

- [ ] EmailService con modo mock
- [ ] Templates con React Email
- [ ] Integración opcional Resend
- [ ] Preview /admin/emails

### Fase 6: Features ✓

- [ ] Sistema de cupones
- [ ] Wishlist
- [ ] Comparador
- [ ] Búsqueda avanzada

---

## 💡 Ventajas de Este Enfoque

### ✅ Pros

1. **$0 de inversión** hasta tener tracción
2. **Arquitectura real** lista para producción
3. **Portfolio impresionante** - E-commerce completo
4. **Testing exhaustivo** sin riesgo financiero
5. **Aprendizaje** de todo el stack
6. **Switching cost bajo** - Solo cambiar mocks por APIs reales

### ⚠️ Consideraciones

1. No pueden procesar pagos reales (obvio)
2. Emails limitados a 100/día (Resend free tier)
3. DB limitado a 500MB (Supabase free tier)

---

## 📝 Siguiente Acción Inmediata

### ¿Por dónde empezamos?

**Opción A: Carrito (Recomendado)**

- Más visual
- Impacto inmediato en UX
- Fácil de implementar
- Tiempo: 1 semana

**Opción B: Admin Dashboard**

- Útil para ti como desarrollador
- Gestión de productos
- Tiempo: 2 semanas

**Opción C: Sistema de Órdenes**

- Backend-heavy
- Menos visual pero crítico
- Tiempo: 1 semana

---

**Mi recomendación:** Empezar con el **Carrito** (Opción A). Es lo que más se nota y te da momentum.

¿Empezamos con el sistema de carrito ahora? 🛒
