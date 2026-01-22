# Documentación Técnica: Resolución de Problemas de Base de Datos y Flujo de Guardado

**Fecha:** 22 de Enero de 2026
**Proyecto:** PC Builder Lite
**Estado:** Resuelto ✅

---

## 1. Resumen Ejecutivo de Incidentes

Se identificaron y resolvieron cuatro problemas críticos que impedían el funcionamiento del módulo de guardado de configuraciones ("biulds"):

1. **Error de Módulo Faltante**: Importación de un cliente Supabase inexistente.
2. **Inconsistencia de Esquema (Schema Mismatch)**: Discrepancia entre la definición de Prisma y la estructura de datos esperada.
3. **Error "Runtime Error" en Producción**: Excepción no controlada debido a claves foráneas inválidas en el caché del usuario.
4. **Error de Redirección (404)**: Ruta de destino incorrecta tras el guardado exitoso y manejo erróneo de la excepción `NEXT_REDIRECT`.

---

## 2. Diagnóstico y Soluciones

### A. Problema de Dependencia Inexistente

**Síntoma:** Error `Cannot find module '@/utils/supabase/server'`.
**Causa:** El archivo de utilidad de Supabase había sido eliminado, pero `app/actions.ts` intentaba importarlo.
**Solución:**

- Se eliminó la dependencia de Supabase en los Server Actions.
- Se migró la lógica para utilizar exclusivamente `prisma`, aprovechando la conexión ya configurada en el proyecto.

### B. Inconsistencia de Base de Datos

**Síntoma:** Imposibilidad de guardar items individuales debido a que el modelo `Build` solo aceptaba un JSON.
**Solución:**

- Se actualizó `prisma/schema.prisma` para soportar relaciones SQL estándar:

```prisma
// Nuevo modelo relacional
model Build {
  id         String      @id @default(uuid())
  // ...
  buildItems BuildItem[]
}

model BuildItem {
  id        String  @id @default(uuid())
  productId String
  // ...
}
```

- Se ejecutó `npx prisma db push` para actualizar la estructura de la base de datos.
- Se ejecutó la semilla de datos (`seed`) para restaurar los productos.

### C. Conflicto de IDs (Runtime Error)

**Síntoma:** Error genérico "No se pudo guardar la configuración" al intentar insertar datos.
**Causa:** Los usuarios tenían productos guardados en `localStorage` con IDs de la base de datos anterior (antes del reset). Al intentar guardarlos, Prisma lanzaba un error de restricción de clave foránea ("Foreign Key Constraint Failed").
**Solución:**

- Se actualizó `store/useBuilder.ts` cambiando la clave de persistencia de `pc-builder-storage` a `pc-builder-storage-v2`.
- Esto forzó una limpieza automática del carrito de los usuarios, evitando errores de referencia inválida.

### D. Flujo de Redirección (NEXT_REDIRECT)

**Síntoma:**

1. Error que mostraba `Error detallado: NEXT_REDIRECT` en el catch block.
2. Error 404 al redirigir a `/build-success`.
   **Causa:**
3. `redirect()` en Next.js lanza una excepción intencional para cortar la ejecución. Al estar dentro de un `try/catch`, el código capturaba la redirección como si fuera un error.
4. La ruta `/build-success` no existía; la ruta dinámica correcta es `/build/[id]`.
   **Solución:**

- Se movió la llamada `redirect()` **fuera** del bloque `try/catch`.
- Se corrigió la URL de destino a `/build/${buildId}`.

---

## 3. Código Final Implementado

### Server Action (`app/actions.ts`)

```typescript
export async function saveBuild(totalPrice: number, selectedParts: any) {
  let buildId: string;

  try {
    const partsArray = Object.values(selectedParts);

    // Transacción atómica: Crea el Build y sus Items simultáneamente
    const build = await prisma.build.create({
      data: {
        name: `PC Build - ${new Date().toLocaleDateString()}`,
        totalPrice: totalPrice,
        buildItems: {
          create: partsArray.map((product: any) => ({
            productId: product.id,
            quantity: 1,
          })),
        },
      },
    });

    buildId = build.id;
  } catch (error: any) {
    console.error("Error al guardar:", error);
    throw new Error("No se pudo guardar la configuración");
  }

  // Redirección fuera del bloque try/catch para evitar falsos positivos
  redirect(`/build/${buildId}`);
}
```

---

## 4. Verificación

El sistema ha sido probado y verificado:

- [x] La base de datos guarda correctamente las relaciones Builds <-> Productos.
- [x] El carrito del usuario se resetea automáticamente si tiene datos obsoletos.
- [x] La redirección lleva a la página de detalle correcta.
- [x] La página de detalle (`/build/[id]`) muestra correctamente los componentes usando las nuevas relaciones.
