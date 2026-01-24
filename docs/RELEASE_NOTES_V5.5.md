# Release Notes - v5.5.0

**Fecha de lanzamiento:** 24 de Enero, 2026  
**Tipo de release:** Patch - Corrección de bugs críticos de autenticación y UX

---

## 📋 Resumen Ejecutivo

Esta versión corrige problemas críticos en el flujo de autenticación que afectaban la experiencia del usuario al intentar guardar builds. Se implementaron mejoras significativas en la gestión de sesiones, redirects y la interfaz de usuario para eliminar comportamientos inesperados.

---

## ✨ Mejoras y Correcciones

### 🔐 Autenticación y Sesión

#### ✅ Sesión Fantasma Solucionada

**Problema:** Después de iniciar sesión, el sistema seguía mostrando el modal de "Inicia sesión para guardar" hasta que el usuario recargaba manualmente la página (F5).

**Solución:**

- Implementado `update()` de NextAuth en `BuildSummary` al montar el componente
- Eliminada la prop `session` pasada desde `BuilderPage` para usar exclusivamente `useSession()`
- El componente ahora detecta automáticamente cambios de sesión y sincroniza el estado

**Archivos modificados:**

- `components/BuildSummary.tsx`
- `app/builder/page.tsx`

---

#### ✅ Redirect Después de Login Corregido

**Problema:** Al iniciar sesión desde el builder, el usuario era redirigido incorrectamente al home (`/`) en lugar de volver al builder.

**Solución:**

- Propagación completa del parámetro `callbackUrl` a través de toda la cadena de autenticación
- Actualización de `login()` en `auth-actions.ts` para aceptar `callbackUrl` opcional
- `LoginPage` ahora extrae `searchParams.callbackUrl` y lo pasa a `LoginForm`
- `LoginForm` utiliza el callback en la acción de login

**Archivos modificados:**

- `app/(auth)/login/page.tsx`
- `components/auth/LoginForm.tsx`
- `app/auth-actions.ts`

---

#### ✅ Flujo de Registro Completo

**Problema:** El flujo Builder → Login → Register → Login → Builder perdía el `callbackUrl`, resultando en redirecciones incorrectas.

**Solución:**

- **LoginForm:** Link "Regístrate aquí" ahora incluye `?callbackUrl=...`
- **RegisterPage:** Acepta `searchParams.callbackUrl` y lo propaga a `RegisterForm`
- **RegisterForm:**
  - Acepta `callbackUrl` como prop
  - Redirige automáticamente a `/login?callbackUrl=...` después del registro exitoso (con delay de 1.5s para mostrar mensaje de éxito)
  - Link "Inicia Sesión" también incluye el callback

**Flujo completo:**

```
Builder (sin sesión)
  → Click "Confirmar Armado"
  → Modal con link a /login?callbackUrl=/builder
  → Click "Regístrate aquí"
  → /register?callbackUrl=/builder
  → Registro exitoso
  → Auto-redirect a /login?callbackUrl=/builder (1.5s)
  → Login exitoso
  → Vuelve a /builder ✅
```

**Archivos modificados:**

- `app/(auth)/register/page.tsx`
- `components/auth/RegisterForm.tsx`
- `components/auth/LoginForm.tsx`

---

#### ✅ Logout Mejorado

**Problema:** El logout no limpiaba completamente la sesión, causando comportamientos inconsistentes.

**Solución:**

- `signOut()` ahora incluye `{ callbackUrl: "/" }` para forzar redirect y limpiar cookies
- Garantiza limpieza completa del estado de autenticación

**Archivos modificados:**

- `components/UserMenu.tsx`

---

### 🎨 Interfaz de Usuario

#### ✅ Modal de Login con Portal

**Problema:** Las estrellas de rating de `ProductCard` se superponían visualmente al `AuthAlertModal` debido a conflictos de z-index.

**Solución:**

- Implementado React Portal (`createPortal`) en `AuthAlertModal`
- El modal ahora se renderiza en `document.body` fuera del flujo DOM normal
- Añadido estado `mounted` para evitar errores de hidratación

**Archivos modificados:**

- `components/AuthAlertModal.tsx`

---

#### ✅ Mejoras de UX Menores

- Añadido `cursor-pointer` en elementos interactivos de reseñas
- Corregido fade del loader en la página del builder
- Mejorada accesibilidad con `aria-label` en botones clave

**Archivos modificados:**

- `components/BuildViewerActions.tsx`
- `components/ProductCard.tsx`
- `components/ReviewModal.tsx`
- `components/landing/Hero.tsx`

---

## 🔧 Cambios Técnicos

### Arquitectura de Sesión

- **Antes:** Sesión manejada con prop drilling (`BuilderPage` → `BuildSummary`)
- **Ahora:** Uso exclusivo de `useSession()` del contexto de NextAuth
- **Beneficio:** Reactividad automática a cambios de sesión

### Gestión de Redirects

- **Patrón implementado:** Callback URL chain
- **Formato:** `?callbackUrl=${encodeURIComponent(destination)}`
- **Cobertura:** Login, Register, y AuthAlertModal

### Portal Pattern

- **Librería:** `react-dom/createPortal`
- **Uso:** Modals que requieren mayor prioridad visual
- **Target:** `document.body`

---

## 📦 Archivos Modificados

| Archivo                             | Cambios    | Tipo     |
| ----------------------------------- | ---------- | -------- |
| `app/(auth)/login/page.tsx`         | +8 líneas  | Feature  |
| `app/(auth)/register/page.tsx`      | +8 líneas  | Feature  |
| `app/auth-actions.ts`               | +3 líneas  | Feature  |
| `app/builder/page.tsx`              | +44 líneas | Refactor |
| `components/AuthAlertModal.tsx`     | +11 líneas | Fix      |
| `components/BuildSummary.tsx`       | +9 líneas  | Fix      |
| `components/BuildViewerActions.tsx` | +1 línea   | UX       |
| `components/ProductCard.tsx`        | +1 línea   | UX       |
| `components/ReviewModal.tsx`        | +2 líneas  | UX       |
| `components/auth/LoginForm.tsx`     | +5 líneas  | Feature  |
| `components/auth/RegisterForm.tsx`  | +13 líneas | Feature  |
| `components/UserMenu.tsx`           | +1 línea   | Fix      |

**Total:** 12 archivos, +129 líneas agregadas, -35 eliminadas

---

## 🚨 Breaking Changes

**Ninguno.** Todos los cambios son retrocompatibles.

---

## 🧪 Testing Realizado

### Flujos Validados

- ✅ Login desde builder sin sesión → Vuelve a builder
- ✅ Logout → Login → Funciona sin F5
- ✅ Builder → Login → Register → Login → Builder (flujo completo)
- ✅ Modal de auth no se superpone con estrellas de rating
- ✅ Sesión persiste correctamente después de reload

### Casos Edge

- ✅ Login con callback URL inválido → Fallback a "/"
- ✅ Register sin callback → Redirige a "/login" limpio
- ✅ Múltiples intentos de login consecutivos

---

## 📝 Notas para Desarrolladores

### Propagación de callbackUrl

Si añades nuevas rutas de autenticación, asegúrate de:

1. Aceptar `callbackUrl` en `searchParams`
2. Pasarlo a los componentes de formulario
3. Incluirlo en links y redirects relacionados

### Uso de Portals

Para modals críticos que necesiten estar siempre visibles:

```tsx
import { createPortal } from "react-dom";
import { useState, useEffect } from "react";

const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
  return () => setMounted(false);
}, []);

if (!mounted) return null;

return createPortal(<YourModal />, document.body);
```

---

## 🔜 Próximos Pasos

- [ ] Implementar funcionalidad de perfil de usuario
- [ ] Sistema de notificaciones en tiempo real
- [ ] Optimización de imágenes de productos
- [ ] Tests E2E para flujos de autenticación

---

## 👥 Contribuidores

- **Arian** - Feature lead & Implementation
- **Antigravity AI** - Code review & Optimization

---

## 📌 Referencias

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [React Portals](https://react.dev/reference/react-dom/createPortal)
- [Next.js App Router](https://nextjs.org/docs/app)

---

**Versión anterior:** v5.4.0  
**Próxima versión planeada:** v5.6.0 (Perfil de usuario)
