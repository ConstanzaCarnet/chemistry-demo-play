# ADR-002 · JavaScript puro, sin framework ni compilación

- **Estado:** Aceptada · 03/10/2026
- **Requisitos relacionados:** P4, P9, RNF-01

## Contexto
Debe abrirse con doble clic (`file://`). Los navegadores no permiten módulos ES (`import`) desde `file://`, y un framework necesita un paso de compilación (`npm run build`).

## Decisión
HTML + CSS + JavaScript sin dependencias. Los módulos son archivos `<script>` clásicos que exponen un único objeto global cada uno (`Safe`, `Chem`, `MUNDOS`, `GEN`, `Labs`, `QQ`), cargados en orden de dependencia.

## Alternativas descartadas
- **React/Vue + Vite:** mejor organización de componentes, pero exige build y servidor de desarrollo; el resultado compilado sí podría abrirse con doble clic, pero el código fuente no.
- **Módulos ES nativos:** fallan en `file://` por CORS.

## Consecuencias
- ✅ Cualquiera puede abrir, leer y modificar el código con un editor de texto.
- ❌ El escape de HTML es manual (en React es automático) → se mitiga con `Safe.escapeHtml` y la regla SEC-01.
- ❌ Globales en `window` → se limitan a uno por módulo.
