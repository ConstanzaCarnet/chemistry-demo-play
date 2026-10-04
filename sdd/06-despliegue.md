# 06 · Despliegue en Vercel

> Cómo publicar la app para compartirla con un link. Decisión registrada en `decisiones/ADR-005-despliegue-vercel.md`.

## Qué se publica y qué no

| Se publica | No se publica (`.vercelignore`) |
|---|---|
| `index.html`, `css/`, `js/` | `tests/`, `sdd/`, `*.md` |

`tests/` y `sdd/` siguen en el repositorio de GitHub (para versionarlos), pero no llegan al sitio.

## Configuración (`vercel.json`)

- **Sin build:** es un sitio estático; Vercel sirve los archivos tal cual.
- **Encabezados de seguridad** en todas las respuestas (requisito SEC-10):

| Encabezado | Para qué |
|---|---|
| `Content-Security-Policy` | Igual que el `<meta>` del HTML, más `frame-ancestors 'none'` (no se puede meter la app en un iframe de otro sitio; esto **no** funciona desde un `<meta>`) y `upgrade-insecure-requests`. |
| `X-Frame-Options: DENY` | Lo mismo que `frame-ancestors` para navegadores viejos (anti *clickjacking*). |
| `X-Content-Type-Options: nosniff` | El navegador no "adivina" tipos de archivo. |
| `Referrer-Policy: no-referrer` | No se filtra la URL a otros sitios. |
| `Permissions-Policy` | Se bloquean cámara, micrófono, ubicación, pagos, USB, sensores y el rastreo publicitario por temas (`browsing-topics`). |
| `Strict-Transport-Security` | Siempre HTTPS, por 2 años. |
| `Cross-Origin-Opener-Policy` / `-Resource-Policy` | Aísla la pestaña y evita que otros sitios incrusten los archivos. |
| `X-Robots-Tag: noindex` | No aparece en Google: solo entra quien tiene el link. **Borralo si querés que sea pública y se pueda encontrar.** |

Verificado: la app completa funciona sin errores de consola con estos encabezados (prueba automatizada con servidor que los imita).

## Pasos — opción A: con GitHub (recomendada, se actualiza sola)

1. Crear un repositorio en GitHub (puede ser privado) y subir la carpeta:
   ```bash
   cd E:\Proyects\ClaudeProyects\QuimicaQuest
   git init
   git add .
   git commit -m "Química Quest v1"
   git branch -M main
   git remote add origin https://github.com/<tu-usuario>/quimica-quest.git
   git push -u origin main
   ```
2. En [vercel.com](https://vercel.com) → **Add New… → Project** → importar el repositorio.
3. **Framework Preset:** `Other`. **Build Command:** vacío. **Output Directory:** vacío (raíz). → **Deploy**.
4. Listo: queda en `https://<nombre>.vercel.app`. Cada `git push` a `main` publica una versión nueva; cada rama/PR genera una URL de vista previa.

## Pasos — opción B: sin GitHub (CLI)

```bash
cd E:\Proyects\ClaudeProyects\QuimicaQuest
npx vercel          # primera vez: login y preguntas (aceptar los valores por defecto)
npx vercel --prod   # publicar en la URL definitiva
```

## Después de publicar — verificación

- [ ] Abrir la URL en la compu y en el celular; recorrer un mundo.
- [ ] Revisar los encabezados: [securityheaders.com](https://securityheaders.com) con tu URL (debería dar **A** o **A+**).
- [ ] Consola del navegador (F12): sin avisos "Refused to…".
- [ ] En el panel de Vercel: **Settings → Deployment Protection** → dejar activada la protección de las vistas previas (así solo la versión de producción es pública).
- [ ] No activar Vercel Analytics/Speed Insights si se quiere mantener P5 (privacidad); además requeriría cambiar `connect-src`.

## Límites del plan gratuito (Hobby)

- Uso **personal y no comercial**. Si se vende o se usa en un emprendimiento → plan Pro.
- 100 GB de transferencia por mes; la app pesa ~150 KB → cientos de miles de visitas.
- Sin SLA (garantía de disponibilidad por contrato).

## Si se cambia algo de seguridad
La CSP está en **dos lugares** (el `<meta>` de `index.html`, para cuando se abre con doble clic, y `vercel.json`). El navegador aplica **ambas**, así que si agregás un recurso externo (por ejemplo una fuente o una API) hay que actualizar las dos.
