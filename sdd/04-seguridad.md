# 04 · Seguridad

> Modelo de amenazas, controles implementados y opciones a futuro. Auditoría realizada el 03/10/2026.

## 1. Superficie de ataque real

La app **no tiene servidor, base de datos ni hace requests**. Por eso:

| Amenaza clásica | ¿Aplica hoy? | Por qué |
|---|---|---|
| **Inyección SQL** | ❌ No | No existe base de datos ni consultas. No hay dónde inyectar. |
| **Inyección en requests / SSRF / CSRF** | ❌ No | La app no envía ni recibe nada por red (`connect-src 'none'`). |
| **XSS (inyección de HTML/JS)** | ✅ **Sí** | La UI arma HTML con texto; si entra texto del usuario sin escapar, se ejecuta código. |
| **Datos guardados manipulados** | ✅ **Sí** | `localStorage` se puede editar desde las herramientas del navegador o con una extensión. |
| **Congelamiento (DoS local)** | ✅ **Sí** | El resolvedor de ecuaciones es exponencial: una ecuación enorme podía colgar la pestaña. |
| **Contenido externo malicioso** | ⚠️ Bajo | Solo se cargan las fuentes de Google; nada de scripts externos. |

**Entradas del usuario:** nombre, respuestas numéricas, fórmulas escritas, ecuación propia del balanceador, fórmula de la calculadora, conversor, y el estado leído de `localStorage`.

## 2. Hallazgos de la auditoría (y su corrección)

| # | Hallazgo | Severidad | Estado |
|---|---|---|---|
| H1 | Valores numéricos del progreso guardado (`xp`, `stats.*`) se insertaban como HTML: un `localStorage` manipulado ejecutaba JS (**confirmado con prueba**). | Media | ✅ Corregido (SEC-03) |
| H2 | La función de escape no escapaba comillas: posible ruptura de atributos (`value="..."`). | Media | ✅ Corregido (SEC-01) |
| H3 | Una ecuación propia con 11 sustancias **congelaba la pestaña** (confirmado). | Baja | ✅ Corregido (SEC-05) |
| H4 | La validación de ecuaciones permitía `<` y `>` sueltos. | Baja | ✅ Corregido (SEC-02) |
| H5 | Índices fuera de rango en el estado guardado se "recortaban" a un índice válido en vez de descartarse. | Baja | ✅ Corregido (SEC-03) |

## 3. Controles implementados

| ID | Control | Dónde |
|---|---|---|
| SEC-01 | **Escape de salida**: todo texto variable que va al HTML pasa por `Safe.escapeHtml` (escapa `& < > " ' \``), directamente o vía `Chem.fmt`/`Chem.chem`. | `security.js`, `chem.js` |
| SEC-02 | **Validación de entrada por lista blanca** (se define lo permitido, no lo prohibido): fórmula `[A-Za-z0-9()[]·*. +-^]`, ecuación ídem + flechas. Se quitan caracteres de control e invisibles (`cleanText`). | `Safe.validate` |
| SEC-03 | **Estado guardado reconstruido**: `sanitizeState` crea un objeto nuevo solo con claves conocidas, tipos correctos y rangos válidos; descarta logros, mundos e índices desconocidos. Inmune a *prototype pollution*. | `Safe.sanitizeState` |
| SEC-04 | **Límites de tamaño**: nombre 18, fórmula 60, ecuación 160, números 40 caracteres (`maxlength` en el HTML **y** chequeo en JS), subíndices 1–999. | `Safe.LIMITS` |
| SEC-05 | **Anti-congelamiento**: máximo 6 sustancias y 3 millones de combinaciones en el resolvedor. | `Chem.resolverBalance` |
| SEC-06 | **Content-Security-Policy**: solo scripts propios (`script-src 'self'`, sin `eval` ni scripts en línea), sin conexiones (`connect-src 'none'`), sin `<object>`, `<iframe>` ni formularios externos. | `index.html` |
| SEC-07 | **Sin `eval`, `new Function`, `document.write`** ni manejadores `onclick="..."` en el HTML: los eventos se registran con `addEventListener`. | todo el código |
| SEC-08 | **Defensa en capas**: aunque algo pase el filtro de caracteres (ej. `1 UNION SELECT`), el parser químico lo rechaza porque no son elementos válidos. | `Chem.parseFormula` |
| SEC-09 | **Privacidad**: no se envían datos, `referrer` desactivado, el nombre es opcional y se puede borrar todo el progreso. | `index.html`, Logros |
| SEC-10 | **Encabezados HTTP al publicar**: CSP con `frame-ancestors 'none'`, `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, HSTS, COOP/CORP; solo se publican `index.html`, `css/` y `js/`. | `vercel.json`, `.vercelignore` |

Verificación: `node tests/security.test.js` (46 casos: payloads XSS e inyección SQL, límites, estado manipulado, prototype pollution, tiempos del resolvedor).

## 4. Si en el futuro se agrega un backend — opciones

Cuando la app tenga servidor (por ejemplo, para que el docente vea el progreso del curso), **sí** aparecen inyección SQL y ataques por request. Opciones, de menor a mayor esfuerzo:

| Opción | Descripción | Controles obligatorios |
|---|---|---|
| **A. Exportar/importar archivo** (sin servidor) | El alumno descarga un `.json` con su progreso y se lo manda al docente. | Validar el archivo con `contratos/estado.schema.json` + `sanitizeState`; límite de tamaño (ej. 100 KB); nunca mostrar su contenido sin escapar. |
| **B. Backend propio** (ASP.NET Core, Laravel, Node) | API REST con base de datos. | Ver lista de abajo. |
| **C. Backend como servicio** (Supabase, Firebase) | Base de datos administrada. | Reglas de acceso por fila (RLS) **siempre activas**; claves públicas con permisos mínimos; validar en reglas/funciones, no solo en el cliente. |

**Lista de controles para la opción B:**
1. **Consultas parametrizadas u ORM** (Entity Framework, Eloquent, Prisma). **Nunca** concatenar texto del usuario en SQL.
   ```csharp
   // ❌ Vulnerable a inyección SQL
   var sql = $"SELECT * FROM Progreso WHERE Alumno = '{nombre}'";
   // ✅ Parametrizado
   var p = await db.Progreso.Where(x => x.Alumno == nombre).ToListAsync();
   // ✅ o con Dapper:  conn.QueryAsync("SELECT * FROM Progreso WHERE Alumno = @nombre", new { nombre });
   ```
2. **Validar en el servidor** con los mismos contratos (JSON Schema / FluentValidation / Form Requests). La validación del cliente es comodidad, no seguridad.
3. **Autenticación** (cuentas del colegio, OAuth) y **autorización**: un alumno solo ve lo suyo; el docente solo su curso.
4. **HTTPS**, cookies `HttpOnly` + `Secure` + `SameSite`, protección **CSRF** si se usan cookies.
5. **CORS** restringido al dominio de la app.
6. **Rate limiting** (ej. 60 requests/min por usuario) y límite de tamaño del body.
7. **No confiar en la XP que manda el cliente**: el servidor debería recalcular o al menos acotar valores.
8. **Logs sin datos personales**, y cumplir la Ley 25.326 de Protección de Datos Personales (Argentina) al tratarse de menores.
9. Dependencias actualizadas (`dotnet list package --vulnerable`, `npm audit`).
