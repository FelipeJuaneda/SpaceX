# Lo que falta hacer de tu lado

El sitio está desplegado y funcionando en **https://space-x-chi-seven.vercel.app** (inglés y
español). Estos pasos no los puedo hacer yo porque requieren entrar a tus cuentas de GitHub y
Vercel. Todos se hacen desde el navegador, en unos 10 minutos en total.

Orden recomendado: 1 → 2 → 3 son importantes; 4 y 5 son opcionales.

---

## 1. Corregir el link del repositorio en GitHub (2 min)

Hoy el repo apunta a un dominio viejo que ya no existe (`space-x-silk-psi.vercel.app`).

1. Entrá a https://github.com/FelipeJuaneda/SpaceX
2. A la derecha, en la caja **About**, hacé clic en el engranaje ⚙️.
3. En **Website** pegá: `https://space-x-chi-seven.vercel.app`
4. En **Description** podés poner, por ejemplo:
   `Downrange: explorador independiente del historial de vuelos de SpaceX (React, TypeScript, TanStack Query). EN/ES.`
5. En **Topics** podés sumar: `react`, `typescript`, `vite`, `tanstack-query`, `spacex`, `data-visualization`.
6. **Save changes**.

## 2. Actualizar la versión de Node.js en Vercel (1 min)

El proyecto en Vercel sigue configurado con **Node 18**, que ya no tiene soporte. Hoy compila
bien, pero Vercel puede dejar de aceptarlo en cualquier momento y los despliegues fallarían.

1. Entrá a https://vercel.com → proyecto **space-x**.
2. **Settings** → **Build and Deployment** (en algunas cuentas figura como **General**).
3. Buscá **Node.js Version** y elegí **22.x** (o la más nueva que ofrezca).
4. **Save**.
5. Para aplicarlo: pestaña **Deployments** → en el último despliegue de producción, menú **⋯** →
   **Redeploy**.

> Si preferís, decime "cambiá la versión de Node en Vercel" y lo hago yo desde acá.

## 3. Activar la actualización diaria de los datos (3 min)

El sitio muestra una "foto" de los datos de Launch Library 2. Hay una automatización
(GitHub Action "Sync launch data") que la actualiza todos los días, pero **nunca se ejecutó**:
GitHub necesita que le des permiso para escribir en el repo.

1. Entrá a https://github.com/FelipeJuaneda/SpaceX/settings/actions
2. En **Actions permissions**, elegí **Allow all actions and reusable workflows** → **Save**.
3. Más abajo, en **Workflow permissions**, elegí **Read and write permissions** → **Save**.
4. Andá a la pestaña **Actions** del repo. Si aparece un botón verde
   **"I understand my workflows, go ahead and enable them"**, hacé clic.
5. En la lista de la izquierda elegí **Sync launch data** → botón **Run workflow** →
   branch **felipejuaneda** → **Run workflow**.
6. Esperá 1–3 minutos. Tiene que quedar con tilde verde ✅. Eso crea un commit
   `chore(data): ...` en `main`, y Vercel despliega solo el sitio con los datos nuevos.

Desde ahí se ejecuta sola todos los días (06:17 UTC). Si alguna vez falla, GitHub te avisa por
mail; en ese caso mandame el error.

## 4. (Opcional) Usar `main` como rama principal

Vercel publica producción desde `main`, pero en GitHub la rama por defecto es `felipejuaneda`.
Funciona igual (la automatización mantiene las dos al día), pero es más claro tener una sola.

1. https://github.com/FelipeJuaneda/SpaceX/settings → sección **Default branch**.
2. Clic en el ícono ⇄ → elegí **main** → **Update** → confirmá.

Si hacés este cambio avisame y simplifico la automatización para que use solo `main`.

## 5. (Opcional) Mostrar el mockup en tu portfolio

Las imágenes ya están copiadas en tu otro proyecto, pero **sin commitear**:

```
portfolio-v2/public/work/spacex-mockup.png        (original, alta resolución)
portfolio-v2/public/work/spacex-mockup-1280.webp  (para usar en la web)
portfolio-v2/public/work/spacex-mockup-640.webp   (versión mobile)
```

1. En el código del portfolio, donde aparece la tarjeta del proyecto SpaceX, usá
   `/work/spacex-mockup-1280.webp` como imagen (y `/work/spacex-mockup-640.webp` para pantallas
   chicas si tu componente acepta `srcset`).
2. Poné como link del proyecto `https://space-x-chi-seven.vercel.app` y como repo
   `https://github.com/FelipeJuaneda/SpaceX`.
3. Commit y push en `portfolio-v2`.

> También lo puedo hacer yo si abrís una sesión en la carpeta `portfolio-v2`.

---

## Cómo comprobar que todo quedó bien

- https://space-x-chi-seven.vercel.app abre y arriba a la derecha están los botones **EN / ES**.
- En **Acerca de** ("Sobre los datos"), el dato "Registro al …" muestra la fecha de hoy o de
  ayer (confirma que el paso 3 funciona).
- En GitHub → Actions, "Sync launch data" tiene ejecuciones diarias en verde.
