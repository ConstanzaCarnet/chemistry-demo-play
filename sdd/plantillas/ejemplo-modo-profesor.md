# Funcionalidad: Modo profesor (EJEMPLO A MEDIO HACER — para practicar)

- **ID:** F-001 · **Estado:** Borrador
- **Autor/a:** — · **Fecha:** 03/10/2026

## 1. Problema / motivación
El docente no tiene forma de saber qué temas les cuestan más a sus alumnos. Hoy el progreso queda solo en el navegador de cada alumno (ADR-001), así que el docente depende de que le cuenten.

## 2. Historias de usuario
- HU-20: Como docente quiero ver qué ejercicios resolvió un alumno para saber en qué reforzar.
- HU-21: Como alumno quiero entregar mi progreso sin crear una cuenta.
- HU-22: <✏️ completá: ¿qué otra necesidad tiene el docente? por ej., ver un resumen del curso>

## 3. Criterios de aceptación
- **Dado** que terminé ejercicios, **cuando** toco "Exportar progreso", **entonces** se descarga un archivo con mi nombre y mis resultados.
- **Dado** un archivo exportado, **cuando** el docente lo abre en "Modo profesor", **entonces** ve por mundo: ejercicios ok / ok2 / fail y las estrellas.
- **Dado** un archivo modificado o corrupto, **cuando** se importa, **entonces** <✏️ completá: ¿qué debe pasar? pista: SEC-03>
- <✏️ agregá un criterio sobre el tamaño máximo del archivo>

## 4. Requisitos
| ID | Requisito | Tipo |
|---|---|---|
| RF-20 | Exportar el estado como archivo `.json` que cumple `contratos/estado.schema.json`. | RF |
| RF-21 | Importar uno o varios archivos y mostrar una tabla alumno × mundo. | RF |
| SEC-10 | <✏️ completá: validación del archivo importado> | SEC |
| SEC-11 | <✏️ completá: límite de tamaño> | SEC |

## 5. Fuera de alcance
- Servidor o cuentas (sigue valiendo ADR-001).
- <✏️ ¿calificaciones automáticas? decidí y justificá>

## 6. Preguntas abiertas
- [ ] ¿El modo profesor necesita contraseña? Si está en la misma app, cualquier alumno puede abrirlo. ¿Importa? → <✏️>
- [ ] ¿El archivo puede ser "falsificado" por un alumno para tener más XP? ¿Es un problema? → <✏️ pista: ADR-004, consecuencias>
- [ ] ¿Qué datos personales viaja en el archivo? → <✏️ pista: P5>

## 7. Impacto en la constitución y en seguridad
- P5 (privacidad): el archivo contiene el nombre del alumno → <✏️>
- Nueva entrada no confiable: **archivo importado** → aplica SEC-01, SEC-02, SEC-03, SEC-04.

## 8–10. Plan, tareas y verificación
<✏️ Completar recién cuando las secciones 1–7 estén aprobadas.>
