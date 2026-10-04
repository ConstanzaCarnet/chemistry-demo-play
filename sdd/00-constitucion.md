# 00 · Constitución del proyecto

> Principios **no negociables**. Cualquier spec, plan o código que los contradiga está mal, aunque "funcione". Cambiar un principio requiere un ADR.

| # | Principio | Qué significa en la práctica |
|---|---|---|
| P1 | **Aprender primero, jugar después** | El juego (XP, logros) existe para motivar el estudio. Ninguna mecánica puede premiar adivinar sin entender (por ej.: la solución revelada da 0 XP). |
| P2 | **Contenido fiel al curso** | La teoría y los ejercicios salen del material de 6° año (Unidad 2, Unidad 4, libro cap. 6). Si el material tiene un error, se corrige y **se avisa** al alumno. |
| P3 | **Todo resultado es verificable** | Cada ejercicio tiene respuesta comprobable automáticamente, explicación y, si es un cálculo, resolución paso a paso. Las respuestas se validan con un script, no "a ojo". |
| P4 | **Funciona sin internet y sin instalación** | Debe abrirse con doble clic en cualquier computadora del colegio. Sin servidor, sin cuentas, sin dependencias que descargar. |
| P5 | **Privacidad por diseño** | No se envía ningún dato a ningún lado. El progreso vive solo en el dispositivo del alumno. No se piden datos personales (el nombre es opcional y libre). |
| P6 | **Seguro por defecto** | Toda entrada del usuario y todo dato guardado se trata como no confiable: se valida, se limita y se escapa antes de usarse (ver `04-seguridad.md`). |
| P7 | **Accesible y en castellano rioplatense** | Textos claros para un/a alumno/a de secundaria, en voseo. Funciona en celular (≥ 360 px) y con teclado. Colores con contraste suficiente; modo oscuro. |
| P8 | **Contenido separado del motor** | Agregar un ejercicio o una card no requiere tocar la lógica: solo los datos, que cumplen un contrato (`contratos/`). |
| P9 | **Simple antes que ingenioso** | Se prefiere código legible por un estudiante de programación a abstracciones complejas. Sin frameworks mientras no haga falta (ver ADR-002). |
