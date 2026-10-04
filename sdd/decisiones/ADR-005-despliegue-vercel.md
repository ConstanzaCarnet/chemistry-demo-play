# ADR-005 · Publicar en Vercel (plan Hobby)

- **Estado:** Aceptada · 03/10/2026
- **Requisitos relacionados:** P4, P5, P6, SEC-10

## Contexto
Se quiere compartir la app con otras personas mediante un link, sin perder lo decidido en ADR-001 (sin servidor) ni ADR-002 (sin build).

## Decisión
Publicar el sitio estático en Vercel (plan Hobby), sin build, con encabezados de seguridad definidos en `vercel.json` y excluyendo `tests/` y `sdd/` con `.vercelignore`. Sin indexar en buscadores (`noindex`) mientras sea de uso privado.

## Alternativas descartadas
- **GitHub Pages:** gratis y simple, pero **no permite configurar encabezados HTTP** (quedaría solo la CSP del `<meta>`, sin `frame-ancestors`).
- **Netlify / Cloudflare Pages:** equivalentes (permiten encabezados con `_headers`). Vercel se elige por integración con GitHub y vistas previas por rama; migrar sería trivial.
- **Hosting propio:** innecesario para un sitio estático.

## Consecuencias
- ✅ HTTPS, CDN global, despliegue automático con cada push, encabezados de seguridad completos.
- ❌ El plan Hobby es solo no comercial y sin SLA.
- ❌ La CSP queda duplicada (`<meta>` + encabezado) y hay que mantener ambas iguales.
- ➡️ El progreso sigue siendo local por dispositivo: publicar no cambia ADR-004.
