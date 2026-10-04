# 02 · Plan técnico

> **Cómo** se construye lo especificado en `01-especificacion.md`. Acá sí se habla de tecnología.

## 1. Arquitectura general

Aplicación **100 % del lado del cliente** (SPA estática). No hay servidor, base de datos ni llamadas de red (ver ADR-001).

```
 index.html ── carga en este orden ──▶ security.js → chem.js → data.js → generators.js → labs.js → app.js
                                          │            │          │            │             │          │
                                    validación   dominio     contenido   ejercicios     herramientas  motor del juego
                                    y escape     químico     (datos)     aleatorios     laboratorio   (UI, estado, rutas)
                                                                                                       │
                                                                                     localStorage ◀────┘ (solo el progreso)
```

| Capa | Módulo | Responsabilidad | Depende de |
|---|---|---|---|
| Seguridad | `js/security.js` → `window.Safe` | Escapar HTML, validar entradas por lista blanca, reconstruir el estado guardado, límites anti-congelamiento | — |
| Dominio | `js/chem.js` → `window.Chem` | Masas atómicas, parser de fórmulas, masa molar, composición, parser de ecuaciones, verificación y resolución de balanceo, formato visual, parseo de números | Safe |
| Contenido | `js/data.js` → `window.MUNDOS`, `window.FICHAS` | Mundos, cards, ejercicios, fichas. **Solo datos.** | — |
| Generación | `js/generators.js` → `window.GEN` | Generadores de ejercicios aleatorios | Chem |
| Herramientas | `js/labs.js` → `window.Labs` | Las 5 herramientas del laboratorio | Chem, Safe, QQ |
| Aplicación | `js/app.js` → `window.QQ` | Estado, router por hash, vistas, motor de ejercicios, XP, logros, sonido, confeti | todos |

Regla de dependencias: **las capas de abajo no conocen a las de arriba** (Chem no sabe nada de la UI). Por eso `chem.js` y `security.js` se pueden testear con Node sin navegador.

## 2. Rutas (router por `location.hash`)

| Ruta | Vista |
|---|---|
| `#/` | Inicio: saludo, modos, mapa de mundos |
| `#/mundo/{id}` o `#/mundo/{id}/teoria` | Cards de teoría |
| `#/mundo/{id}/ejercicios` | Ejercicios del mundo |
| `#/mundo/{id}/practica` | Práctica extra (si el mundo tiene generadores) |
| `#/lab/{balance\|masa\|ph\|reactor\|tabla}` | Laboratorio |
| `#/desafio` · `#/fichas` · `#/logros` | Modos |

Ruta desconocida → inicio. Los IDs de mundo se buscan en `MUNDOS`; si no existen, inicio (nunca se usa el hash como HTML).

## 3. Modelo de datos

Contratos formales en `contratos/*.schema.json`. Resumen:

```
Mundo { id, num, icon, color, titulo, sub, fuente, cards: Card[], ejercicios: Ejercicio[], practica?: string[] }
Card  { icon, title, body?, html?, list?, example?{title, lines[]}, steps?{title, items[]}, tip?, fact? }
Ejercicio = Mc | Tf | Num | Multi | Formula | Bal | Match        (discriminado por el campo t)
  comunes: exp?, steps?, hint?
Estado { name, xp, worlds{ [mundoId]: { seen:int[], ex:{ [idx]: 'ok'|'ok2'|'fail' } } },
         badges:string[], stats{correct, wrong, balances, streak, streakMax, bestChallenge, practice, flips, labs[]},
         sound:bool, theme:''|'light'|'dark' }
```

**Mini-markup del contenido** (lo interpreta `Chem.fmt`, que escapa todo antes): `{H2SO4}` fórmula · `**negrita**` · `__cursiva__` · `10^23` superíndice · `\n` salto de línea · `->` flecha. El campo `html` de las cards es HTML **de autor** (confiable, nunca proviene del usuario).

## 4. Algoritmos clave

### 4.1 Parser de fórmulas (`Chem.parseFormula`)
Recorrido de izquierda a derecha con una **pila** para paréntesis/corchetes. Cada símbolo debe existir en la tabla de masas. Los hidratos (`CuSO4·5H2O`) se separan por `·`, `*` o `.` y el número inicial de cada parte multiplica. Devuelve `{ elemento: cantidad }`. Errores: elemento desconocido, paréntesis sin cerrar, subíndice fuera de 1–999, fórmula > 60 caracteres.

### 4.2 Verificación de balanceo
Para cada elemento: Σ(coef × átomos) en reactivos = Σ en productos. Además MCD(coeficientes) = 1 (enteros mínimos).

### 4.3 Resolución automática de balanceo (`resolverBalance`)
Fuerza bruta con poda incremental: prueba coeficientes 1..max por sustancia, manteniendo la suma de átomos por elemento. Con ≤ 6 sustancias y presupuesto de 3 millones de combinaciones (el `max` baja automáticamente si hace falta) resuelve todas las ecuaciones escolares en < 1 s. Más de 6 sustancias → error inmediato (SEC-05).

### 4.4 Comparación numérica
`parseNum` normaliza (coma → punto, `x10^`, `e`, unidades al final) y `aproxIgual` compara con **error relativo** ≤ `tol` (2 % por defecto). `tol: 0` → comparación exacta.

### 4.5 Generadores
Cada generador elige al azar sustancia/reacción/cantidad "redonda" (múltiplos de la masa molar) para que los números sean razonables, calcula la respuesta con `Chem` y arma los pasos de resolución.

## 5. Persistencia
Una sola clave de `localStorage` (`quimica-quest-v1`) con el `Estado` serializado. **Al cargar** se reconstruye campo por campo con `Safe.sanitizeState` (nunca se usa el JSON tal cual). Si el almacenamiento no está disponible, la app funciona igual sin guardar.

## 6. Interfaz
- HTML generado por plantillas de texto; **todo dato variable pasa por `Safe.escapeHtml`/`Chem.fmt`/`Chem.chem`**.
- CSS con variables (tokens de color) para tema claro/oscuro; color propio por mundo (`--wc`).
- Responsive con grillas y `@media` en 860 px y 600 px.
- Fuentes Fredoka/Nunito (Google Fonts) con alternativa del sistema si no hay internet.

## 7. Mapeo para portar a otro stack

| Concepto | Actual (vanilla JS) | React + TS | Blazor (.NET / C#) | Flutter |
|---|---|---|---|---|
| Dominio químico | `chem.js` | `domain/chem.ts` (funciones puras) | `Domain/Chem.cs` (clase estática) | `lib/domain/chem.dart` |
| Validación | `security.js` | `zod` + funciones propias | DataAnnotations + `Safe.cs` | validadores propios |
| Contenido | `data.js` | `content/*.json` validado con los schemas | `wwwroot/content/*.json` + `System.Text.Json` | `assets/content/*.json` |
| Estado | objeto `S` + localStorage | `zustand`/`useReducer` + localStorage | servicio scoped + `Blazored.LocalStorage` | `provider`/`riverpod` + `shared_preferences` |
| Rutas | hash manual | `react-router` | `@page` + `NavigationManager` | `go_router` |
| Render seguro | `escapeHtml` manual | JSX escapa por defecto (evitar `dangerouslySetInnerHTML`) | Razor escapa por defecto (evitar `MarkupString`) | widgets (no hay HTML) |
| Tests | `node tests/*.test.js` | Vitest | xUnit | `flutter test` |

> Los **contratos** (`contratos/`) y los **tests de dominio** son lo primero que hay que portar: si `parseFormula` y `resolverBalance` pasan los mismos casos, el resto es interfaz.
