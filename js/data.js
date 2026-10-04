/* =========================================================
   data.js — contenido: mundos, cards de teoría y ejercicios.
   Mini-markup: {H2O} fórmula · **negrita** · __cursiva__ · 10^23
   Tipos de ejercicio:
     mc      opción múltiple       {q, op:[], a:índice}
     tf      verdadero / falso      {q, a:true|false}
     num     respuesta numérica     {q, a, tol, unit}
     multi   varios valores         {q, fields:[{l, a, tol, unit}]}
     formula escribir una fórmula   {q, a:'NaN3'}
     bal     balancear ecuación     {r:[...], p:[...]}
     match   unir parejas           {q, pairs:[[izq, der], ...]}
   Todos aceptan: exp (explicación), steps (resolución), hint (pista)
   ========================================================= */
window.MUNDOS = [

/* ======================= 1. REACCIONES ======================= */
{
  id: 'reacciones', num: 1, icon: '🧪', color: '#8b5cf6',
  titulo: '¿Qué es una reacción química?',
  sub: 'Reactivos, productos, ecuaciones y cómo darte cuenta de que algo reaccionó',
  fuente: 'Unidad 2 · Libro cap. 6.1',
  cards: [
    {
      icon: '⚗️', title: 'Reacción química',
      body: `Una **reacción química** ocurre cuando una o más sustancias iniciales, los **reactivos**, se transforman en una o más sustancias nuevas, los **productos**.\n\nEn un cambio químico **los átomos no se crean ni se destruyen**: solo cambia la manera en la que se agrupan. Se rompen enlaces de los reactivos y se forman enlaces nuevos en los productos.`,
      example: { title: 'Ejemplo: la piedra caliza al calentarse', lines: ['{CaCO3(s) -> CaO(s) + CO2(g)}', 'Carbonato de calcio → óxido de calcio (cal viva) + dióxido de carbono'] },
      tip: 'REACTIVOS → PRODUCTOS. Los reactivos van a la izquierda de la flecha y los productos a la derecha.'
    },
    {
      icon: '📝', title: 'La ecuación química',
      body: `Es la forma **escrita** de representar una reacción usando fórmulas químicas.\n\nSi los símbolos de los elementos son las **letras** y las fórmulas son las **palabras**, las ecuaciones químicas son las **frases** del lenguaje químico.`,
      html: `<div class="eq-anatomy">
        <div class="eq-big">${'{NaOH(ac) + HCl(ac) -> NaCl(ac) + H2O(l)}'}</div>
        <div class="eq-labels"><span class="lab-r">⬅ Reactivos</span><span class="lab-f">flecha = “se transforma en”</span><span class="lab-p">Productos ➡</span></div>
      </div>`,
      list: ['**Coeficiente estequiométrico**: el número grande adelante de la fórmula (el 2 de {2H2O}). Indica cuántas moléculas o moles.', '**Subíndice**: el número chiquito dentro de la fórmula (el 2 de {H2O}, que va abajo). Indica cuántos átomos de ese elemento hay en la molécula.'],
      tip: '“Reacción” es el proceso que ocurre; “ecuación” es cómo lo escribimos. Por eso NO son sinónimos.'
    },
    {
      icon: '🧊', title: 'Estados de agregación',
      body: `Las ecuaciones se completan indicando el estado físico de cada sustancia, a la derecha de su fórmula:`,
      html: `<div class="states-grid">
        <div class="state"><b>(s)</b><span>sólido</span><small>{Fe(s)}</small></div>
        <div class="state"><b>(l)</b><span>líquido</span><small>{H2O(l)}</small></div>
        <div class="state"><b>(g)</b><span>gas</span><small>{O2(g)}</small></div>
        <div class="state"><b>(ac)</b><span>solución acuosa (disuelto en agua)</span><small>{NaCl(ac)}</small></div>
      </div>`,
      example: { title: 'El símbolo Δ', lines: ['Un **Δ** sobre la flecha indica que hay que **calentar** para que la reacción ocurra.', '{2AsH3(g)} —Δ→ {2As(s) + 3H2(g)}'] }
    },
    {
      icon: '👀', title: '¿Cómo me doy cuenta de que hubo reacción?',
      body: `Las reacciones químicas se **manifiestan** de distintas formas. Estas son las 5 señales clásicas:`,
      html: `<div class="manif-grid">
        <div class="manif"><span>🫧</span><b>Emisión de gases</b><small>Burbujas (efervescencia): una pastilla vitamínica en agua. La pólvora produce gases que se expanden y provocan la explosión.</small></div>
        <div class="manif"><span>💡</span><b>Emisión de luz</b><small>Fuegos artificiales. También seres vivos como las luciérnagas y algunas medusas: <i>bioluminiscencia</i>.</small></div>
        <div class="manif"><span>🌡️</span><b>Cambio de temperatura</b><small>Se rompen y forman enlaces: se absorbe o se libera calor. Una fogata libera calor.</small></div>
        <div class="manif"><span>🧂</span><b>Precipitado</b><small>Se forma un sólido que cae al fondo. El sarro de las calderas: carbonatos de magnesio y calcio.</small></div>
        <div class="manif"><span>🎨</span><b>Cambio de color</b><small>Una manzana cortada se vuelve marrón al contacto con el aire.</small></div>
      </div>`,
      tip: 'Ojo: un cambio de color no siempre indica reacción química (por ejemplo, mezclar dos pinturas).'
    },
    {
      icon: '🔄', title: 'Reversibles e irreversibles',
      body: `La **flecha** indica el sentido de la reacción.\n\n**Irreversible (→)**: los reactivos se transforman en productos y no vuelven atrás. Ej.: quemar un papel.\n\n**Reversible (⇄)**: los productos pueden volver a reaccionar para formar los reactivos originales. Se usa doble flecha.`,
      example: { title: 'Reacción reversible: hierro y vapor de agua', lines: ['{3Fe(s) + 4H2O(g) <=> Fe3O4(s) + 4H2(g)}', 'Se forma óxido de hierro (magnetita) e hidrógeno, y también puede ocurrir al revés.'] }
    },
    {
      icon: '🔬', title: 'Interpretación micro y macro',
      body: `Una ecuación ajustada se puede leer a escala de **átomos y moléculas** (microscópica) o en **cantidades medibles** (macroscópica, en moles).`,
      html: `<div class="micro-macro">
        <div class="eq-big">{2NO(g) + O2(g) -> 2NO2(g)}</div>
        <table class="tbl"><tr><th></th><th>{NO}</th><th>{O2}</th><th>{NO2}</th></tr>
        <tr><td>Micro</td><td>2 moléculas</td><td>1 molécula</td><td>2 moléculas</td></tr>
        <tr><td>×10</td><td>20 moléculas</td><td>10 moléculas</td><td>20 moléculas</td></tr>
        <tr><td>Macro</td><td>2 mol</td><td>1 mol</td><td>2 mol</td></tr></table>
      </div>`,
      tip: 'Los coeficientes indican la proporción de moléculas Y también la proporción de moles. Siempre 2 : 1 : 2 en este caso.'
    },
    {
      icon: '⚠️', title: 'Química y seguridad',
      body: `Las reacciones pueden ser peligrosas sin la información adecuada.\n\n• Mezclar **lavandina** con **ácido muriático** (ácido clorhídrico) produce **cloro** ({Cl2}), un gas amarillo verdoso muy tóxico.\n\n• Al diluir un ácido: **se agrega el ácido sobre el agua**, nunca al revés. ¡**Nunca dar de beber al ácido**! Si se echa agua sobre el ácido, se libera tanto calor que puede salpicar.`,
      fact: 'En 1962 Neil Bartlett preparó el primer compuesto de un gas noble ({XePtF6}). ¡Nadie creía que los gases nobles pudieran reaccionar!'
    },
    {
      icon: '🧙', title: 'Los alquimistas',
      body: `El emperador romano Calígula financió un proyecto para obtener oro a partir del **oropimente**, un sulfuro de arsénico amarillo dorado. Fracasó, y los alquimistas medievales también.\n\n¿Por qué? Porque en una reacción química **los átomos no cambian de elemento**: con átomos de As y S nunca vas a obtener átomos de Au. Las reacciones solo reagrupan átomos.`,
      fact: 'En el ejercicio de fórmulas empíricas vas a calcular la fórmula del oropimente a partir de su composición: 60,90 % As y 39,10 % S.'
    }
  ],
  ejercicios: [
    { t: 'mc', q: 'En una reacción química, ¿qué se conserva siempre?', op: ['Las moléculas', 'Los átomos de cada elemento', 'El estado de agregación', 'El color de las sustancias'], a: 1, exp: 'Los átomos no se crean ni se destruyen: solo se reagrupan formando sustancias nuevas. Las moléculas sí cambian.' },
    { t: 'tf', q: '“Reacción química” y “ecuación química” son sinónimos.', a: false, exp: 'La reacción es el proceso real; la ecuación es su representación escrita con fórmulas.' },
    { t: 'mc', q: 'En la ecuación {NaOH(ac) + HCl(ac) -> NaCl(ac) + H2O(l)}, ¿cuáles son los productos?', op: ['{NaOH} y {HCl}', '{NaCl} y {H2O}', '{NaOH} y {NaCl}', 'Solo {H2O}'], a: 1, exp: 'Los productos se escriben a la derecha de la flecha.' },
    { t: 'mc', q: '¿Qué significa el símbolo (ac) en {NaCl(ac)}?', op: ['Que es un ácido', 'Que está en estado sólido', 'Que está disuelto en agua (solución acuosa)', 'Que es un gas'], a: 2, exp: '(ac) = acuoso: la sustancia está disuelta en agua.' },
    { t: 'match', q: 'Uní cada manifestación con su ejemplo', pairs: [['Emisión de gases', 'Pastilla efervescente en agua'], ['Emisión de luz', 'Luciérnagas'], ['Cambio de temperatura', 'Fogata'], ['Formación de precipitado', 'Sarro en las calderas'], ['Cambio de color', 'Manzana cortada que se pone marrón']], exp: 'Son las cinco manifestaciones de las reacciones químicas que vimos en la teoría.' },
    { t: 'mc', q: 'La doble flecha ⇄ en una ecuación indica que la reacción es…', op: ['Irreversible', 'Reversible', 'Exotérmica', 'Muy rápida'], a: 1, exp: 'En una reacción reversible los productos pueden volver a formar los reactivos.' },
    { t: 'num', q: 'En {2NO + O2 -> 2NO2}, si reaccionan 20 moléculas de {NO}, ¿cuántas moléculas de {O2} se necesitan?', a: 10, tol: 0, unit: 'moléculas', hint: 'La proporción es 2 : 1 : 2.', exp: 'La relación NO : O₂ es 2 : 1. Con 20 moléculas de NO se necesita la mitad: 10 moléculas de O₂.' },
    { t: 'num', q: 'En {2NO + O2 -> 2NO2}, ¿cuántos moles de {NO2} se forman con 3 moles de {O2} (y NO suficiente)?', a: 6, tol: 0, unit: 'mol', exp: 'Por cada 1 mol de O₂ se forman 2 mol de NO₂. 3 × 2 = 6 mol.' },
    { t: 'mc', q: '¿Qué indica un Δ escrito sobre la flecha?', op: ['Que se libera luz', 'Que hay que calentar', 'Que se forma un gas', 'Que la reacción es reversible'], a: 1, exp: 'Δ indica que es necesario calentar para que la reacción ocurra.' },
    { t: 'tf', q: 'Para diluir un ácido concentrado hay que echarle agua encima.', a: false, exp: '¡Al revés! Se agrega el ácido sobre el agua, lentamente. “Nunca dar de beber al ácido”.' },
    { t: 'mc', q: '¿Por qué los alquimistas nunca pudieron obtener oro a partir del oropimente (sulfuro de arsénico)?', op: ['Porque no calentaban lo suficiente', 'Porque en una reacción química los átomos no cambian de elemento', 'Porque el oro es un gas', 'Porque les faltaba un catalizador'], a: 1, exp: 'Las reacciones químicas solo reagrupan átomos: con As y S solo podés obtener sustancias con As y S.' },
    { t: 'mc', q: 'Mezclar lavandina con ácido muriático es peligroso porque se produce…', op: ['Oxígeno', 'Cloro gaseoso ({Cl2}), muy tóxico', 'Agua oxigenada', 'Dióxido de carbono'], a: 1, exp: 'Se libera Cl₂, un gas amarillo verdoso muy tóxico que incluso se usó como arma química.' }
  ]
},

/* ======================= 2. TIPOS ======================= */
{
  id: 'tipos', num: 2, icon: '🧩', color: '#ec4899',
  titulo: 'Tipos de reacciones y energía',
  sub: 'Síntesis, descomposición, sustitución, combustión, neutralización, redox, exo y endo',
  fuente: 'Unidad 2',
  cards: [
    {
      icon: '➕', title: 'Síntesis (combinación)',
      body: `Dos o más sustancias reaccionan para formar **un único producto**.`,
      html: `<div class="pattern">A + B → C</div>`,
      example: { title: 'Ejemplos', lines: ['{N2(g) + 3H2(g) -> 2NH3(g)} (síntesis del amoníaco)', '{2Mg(s) + O2(g) -> 2MgO(s)}', '{Si + 2Cl2 -> SiCl4}'] }
    },
    {
      icon: '💥', title: 'Descomposición',
      body: `**Un solo reactivo** se descompone en dos o más productos. Suele necesitar energía (calor, electricidad).`,
      html: `<div class="pattern">A → B + C</div>`,
      example: { title: 'Ejemplos', lines: ['{2H2O(l) -> 2H2(g) + O2(g)} (electrólisis del agua con una pila)', '{CaCO3(s) -> CaO(s) + CO2(g)} (piedra caliza)', '{2NH4NO3 -> 2N2 + 4H2O + O2}'] }
    },
    {
      icon: '🔁', title: 'Sustitución simple',
      body: `Un elemento **reemplaza** a otro dentro de un compuesto.`,
      html: `<div class="pattern">A + BC → AC + B</div>`,
      example: { title: 'Ejemplos', lines: ['{Fe(s) + 2HCl(ac) -> FeCl2(ac) + H2(g)}', '{Zn + 2HCl -> ZnCl2 + H2}', 'El hierro y el cinc desplazan al hidrógeno del ácido.'] }
    },
    {
      icon: '💃', title: 'Doble sustitución',
      body: `Dos compuestos **intercambian** sus partes (“cambio de pareja”).`,
      html: `<div class="pattern">AB + CD → AD + CB</div>`,
      example: { title: 'Ejemplos', lines: ['{AgNO3 + NaCl -> AgCl + NaNO3}  (se forma un precipitado blanco de AgCl)', '{BaCl2 + Na2SO4 -> BaSO4 + 2NaCl}'] }
    },
    {
      icon: '🔥', title: 'Combustión',
      body: `Un combustible reacciona con **oxígeno** ({O2}), liberando energía (calor y luz). Si el combustible tiene C e H, la combustión completa produce **{CO2} y {H2O}**.`,
      example: { title: 'Ejemplos', lines: ['{CH4 + 2O2 -> CO2 + 2H2O} (gas natural)', '{C3H8 + 5O2 -> 3CO2 + 4H2O} (propano, garrafa)'] }
    },
    {
      icon: '⚖️', title: 'Neutralización',
      body: `Un **ácido** reacciona con una **base** (hidróxido) y se forman **sal + agua**. Es un caso de doble sustitución.`,
      html: `<div class="pattern">ácido + base → sal + agua</div>`,
      example: { title: 'Ejemplos', lines: ['{HCl + NaOH -> NaCl + H2O} (sal binaria)', '{HNO3 + KOH -> KNO3 + H2O} (sal ternaria)', '{H2SO4 + 2NaOH -> Na2SO4 + 2H2O}'] }
    },
    {
      icon: '⚡', title: 'Óxido-reducción (redox)',
      body: `Reacciones en las que **cambia el número de oxidación** de los elementos porque se transfieren electrones.\n\n• **Oxidación**: un átomo **pierde** electrones → su número de oxidación **sube**.\n• **Reducción**: un átomo **gana** electrones → su número de oxidación **baja**.\n\nSiempre ocurren juntas: si alguien pierde electrones, otro los gana.`,
      example: { title: 'Ejemplo', lines: ['{Zn + CuSO4 -> ZnSO4 + Cu}', 'Zn: 0 → +2 (se oxida, pierde 2 e⁻)', 'Cu: +2 → 0 (se reduce, gana 2 e⁻)'] },
      tip: 'Truco: “**Re**ducción = **Re**cibe electrones”.'
    },
    {
      icon: '🌡️', title: 'Energía: exo y endotérmicas',
      body: `Romper y formar enlaces implica intercambiar energía con el ambiente (calor, luz, electricidad).\n\n• **Exotérmica**: **libera** calor al ambiente. Ej.: combustión del gas, una fogata, la pólvora.\n• **Endotérmica**: **absorbe** calor; necesita aporte de energía para producirse. Ej.: la cocción de un huevo, la descomposición de la piedra caliza, la fotosíntesis.`,
      tip: 'EXO = sale (calor hacia afuera). ENDO = entra (calor hacia adentro).'
    }
  ],
  ejercicios: [
    { t: 'mc', q: '¿Qué tipo de reacción es {Si + 2Cl2 -> SiCl4}?', op: ['Síntesis', 'Descomposición', 'Sustitución simple', 'Doble sustitución'], a: 0, exp: 'Dos reactivos forman un único producto: síntesis.' },
    { t: 'mc', q: '¿Qué tipo de reacción es {HNO3 + KOH -> KNO3 + H2O}?', op: ['Combustión', 'Neutralización', 'Síntesis', 'Descomposición'], a: 1, exp: 'Ácido + base → sal + agua: neutralización.' },
    { t: 'mc', q: '¿Qué tipo de reacción es {Zn + 2HCl -> ZnCl2 + H2}?', op: ['Doble sustitución', 'Síntesis', 'Sustitución simple', 'Neutralización'], a: 2, exp: 'El cinc reemplaza al hidrógeno del ácido: A + BC → AC + B.' },
    { t: 'mc', q: '¿Qué tipo de reacción es {2NH4NO3 -> 2N2 + 4H2O + O2}?', op: ['Síntesis', 'Descomposición', 'Combustión', 'Sustitución simple'], a: 1, exp: 'Un único reactivo se separa en varios productos.' },
    { t: 'mc', q: '¿Qué tipo de reacción es {BaCl2 + Na2SO4 -> BaSO4 + 2NaCl}?', op: ['Doble sustitución', 'Sustitución simple', 'Síntesis', 'Redox'], a: 0, exp: 'Los dos compuestos intercambian sus partes: Ba con SO₄ y Na con Cl.' },
    { t: 'mc', q: '¿Qué tipo de reacción es {C3H8 + 5O2 -> 3CO2 + 4H2O}?', op: ['Descomposición', 'Neutralización', 'Combustión', 'Doble sustitución'], a: 2, exp: 'Un combustible con C e H reacciona con O₂ y da CO₂ + H₂O.' },
    { t: 'match', q: 'Uní cada tipo de reacción con su esquema', pairs: [['Síntesis', 'A + B → C'], ['Descomposición', 'A → B + C'], ['Sustitución simple', 'A + BC → AC + B'], ['Doble sustitución', 'AB + CD → AD + CB'], ['Neutralización', 'ácido + base → sal + agua']] },
    { t: 'mc', q: 'Una fogata libera calor al ambiente. Es una reacción…', op: ['Endotérmica', 'Exotérmica', 'Reversible', 'De descomposición'], a: 1, exp: 'Libera calor: exotérmica.' },
    { t: 'mc', q: 'La fotosíntesis necesita energía de la luz solar para producirse. Es…', op: ['Exotérmica', 'Endotérmica', 'Una neutralización', 'Una combustión'], a: 1, exp: 'Absorbe energía: endotérmica.' },
    { t: 'tf', q: 'En una reacción redox, la sustancia que gana electrones se oxida.', a: false, exp: 'La que gana electrones se REDUCE (su número de oxidación baja). La que pierde electrones se oxida.' },
    { t: 'mc', q: 'En {Zn + CuSO4 -> ZnSO4 + Cu}, ¿qué elemento se oxida?', op: ['Cu', 'Zn', 'S', 'O'], a: 1, hint: 'Fijate quién pasa de número de oxidación 0 a +2.', exp: 'El Zn pasa de 0 a +2: pierde electrones, se oxida. El Cu pasa de +2 a 0: se reduce.' },
    { t: 'mc', q: 'En {Fe + 2HCl -> FeCl2 + H2}, el hidrógeno pasa de +1 a 0. El hidrógeno…', op: ['Se oxida', 'Se reduce', 'No cambia', 'Se neutraliza'], a: 1, exp: 'Su número de oxidación baja: gana electrones, se reduce. El Fe (0 → +2) se oxida.' }
  ],
  practica: ['tipoGen']
},

/* ======================= 3. BALANCEO ======================= */
{
  id: 'balanceo', num: 3, icon: '⚖️', color: '#06b6d4',
  titulo: 'Balanceo de ecuaciones',
  sub: 'Ley de conservación de la masa y método de tanteo',
  fuente: 'Unidad 2 · Libro cap. 6.1',
  cards: [
    {
      icon: '⚖️', title: 'Ley de conservación de la masa',
      body: `**“En una reacción química la masa total de los reactivos es igual a la masa total de los productos.”** (Lavoisier)\n\nComo los átomos solo se reagrupan, la balanza marca lo mismo antes y después.`,
      html: `<div class="balanza-demo">
        <div><div class="scale-num">184,34 g</div><small>antes: {CaCl2(ac)} y {Na2SO4(ac)} separados</small></div>
        <div class="arrow">→</div>
        <div><div class="scale-num">184,34 g</div><small>después: {NaCl(ac)} + {CaSO4(s)} (precipitado)</small></div>
      </div>`,
      tip: 'Por eso hay que **balancear (ajustar)** las ecuaciones: para que haya el mismo número de átomos de cada elemento a ambos lados.'
    },
    {
      icon: '🔢', title: 'Coeficientes, ¡no subíndices!',
      body: `Las ecuaciones se ajustan cambiando los **coeficientes** (los números de adelante), **nunca los subíndices**.`,
      example: { title: 'Ejemplo: {NO + O2 -> NO2}', lines: ['❌ Sin ajustar: 3 O a la izquierda, 2 O a la derecha.', '✅ {2NO + O2 -> 2NO2} : 2 N y 4 O de cada lado.', '🚫 {NO + O2 -> NO3} “cierra” en átomos pero es OTRA sustancia (trióxido de nitrógeno), no el dióxido de nitrógeno.'] },
      tip: 'Cambiar un subíndice cambia la sustancia. {H2O} es agua, {H2O2} es agua oxigenada.'
    },
    {
      icon: '🎯', title: 'Método de tanteo',
      body: `Orden recomendado para probar coeficientes:`,
      list: ['1️⃣ Metales', '2️⃣ No metales (menos H y O)', '3️⃣ Hidrógeno', '4️⃣ Oxígeno (al final)', 'Los elementos solos ({O2}, {H2}, {Fe}) conviene ajustarlos al final porque no afectan a otros elementos.', 'Si aparece un grupo que no cambia (como {SO4} o {PO4}), contalo como un bloque.', 'Si te queda una fracción (½ {O2}), multiplicá TODO por 2.', 'Al final, los coeficientes deben ser los enteros más chicos posibles.']
    },
    {
      icon: '🪜', title: 'Paso a paso: combustión del metano',
      body: `Ajustemos {CH4 + O2 -> CO2 + H2O}`,
      steps: { title: 'Tocá “siguiente paso”', items: [
        '**Carbono**: 1 C a la izquierda, 1 C a la derecha. ✓ Ya está.',
        '**Hidrógeno**: 4 H en {CH4}, 2 H en {H2O}. Pongo un 2 en el agua: {CH4 + O2 -> CO2 + 2H2O}',
        '**Oxígeno**: a la derecha hay 2 (en {CO2}) + 2 (en {2H2O}) = 4 O. A la izquierda pongo {2O2} = 4 O.',
        '✅ Resultado: {CH4 + 2O2 -> CO2 + 2H2O} — 1 C, 4 H y 4 O de cada lado.'
      ] }
    },
    {
      icon: '🪜', title: 'Paso a paso: con fracciones',
      body: `Ajustemos {Al + Cl2 -> AlCl3}`,
      steps: { title: 'Tocá “siguiente paso”', items: [
        'El Al ya está: 1 y 1. El Cl: 2 a la izquierda, 3 a la derecha.',
        'Para tener 3 Cl a la izquierda necesito 3/2 de {Cl2}: {Al + 3/2Cl2 -> AlCl3}',
        'No se dejan fracciones: multiplico TODO por 2.',
        '✅ {2Al + 3Cl2 -> 2AlCl3} — 2 Al y 6 Cl de cada lado.'
      ] }
    },
    {
      icon: '🪜', title: 'Paso a paso: con grupo poliatómico',
      body: `Ajustemos {Na3PO4 + AgNO3 -> Ag3PO4 + NaNO3}`,
      steps: { title: 'Tocá “siguiente paso”', items: [
        'El {PO4} y el {NO3} pasan enteros: los cuento como bloques.',
        '**Ag**: 1 a la izquierda, 3 a la derecha → {3AgNO3}',
        '**Na**: 3 a la izquierda, 1 a la derecha → {3NaNO3}',
        '**NO3**: 3 y 3 ✓ · **PO4**: 1 y 1 ✓',
        '✅ {Na3PO4 + 3AgNO3 -> Ag3PO4 + 3NaNO3}'
      ] }
    }
  ],
  ejercicios: [
    { t: 'bal', r: ['H2', 'O2'], p: ['H2O'] },
    { t: 'bal', r: ['N2', 'H2'], p: ['NH3'] },
    { t: 'bal', r: ['HCl'], p: ['H2', 'Cl2'] },
    { t: 'bal', r: ['Cu(OH)2', 'HF'], p: ['CuF2', 'H2O'] },
    { t: 'bal', r: ['H2O', 'N2O5'], p: ['HNO3'] },
    { t: 'bal', r: ['Cl2', 'O2'], p: ['Cl2O7'], hint: 'Te va a quedar una fracción de O₂: multiplicá todo por 2.' },
    { t: 'bal', r: ['Al', 'Cl2'], p: ['AlCl3'] },
    { t: 'bal', r: ['HgO'], p: ['Hg', 'O2'] },
    { t: 'bal', r: ['S8', 'O2'], p: ['SO2'] },
    { t: 'tf', q: 'La ecuación {MgCO3 -> MgO + CO2} ya está ajustada.', a: true, exp: '1 Mg, 1 C y 3 O de cada lado.' },
    { t: 'bal', r: ['Na', 'H2O'], p: ['NaOH', 'H2'] },
    { t: 'bal', r: ['Fe', 'O2'], p: ['Fe2O3'] },
    { t: 'bal', r: ['C3H8', 'O2'], p: ['CO2', 'H2O'] },
    { t: 'bal', r: ['Na3PO4', 'AgNO3'], p: ['Ag3PO4', 'NaNO3'] },
    { t: 'mc', q: 'Para la descomposición del nitrato de plomo (II), un alumno escribió {Pb(NO3)2 -> 2NO2 + PbO + O}. ¿Qué está mal?', op: ['Nada, está bien', 'El oxígeno no existe como átomo suelto: es {O2}', 'Falta un coeficiente en {PbO}', 'El {NO2} debería ser {NO3}'], a: 1, exp: 'El oxígeno gaseoso es diatómico: O₂. La ecuación correcta es 2Pb(NO₃)₂ → 4NO₂ + 2PbO + O₂.' },
    { t: 'bal', r: ['Pb(NO3)2'], p: ['NO2', 'PbO', 'O2'] },
    { t: 'mc', q: 'La reacción {4NH3 + 6NO -> 5N2 + 6H2O} está ajustada. ¿Cuál de estas también es válida?', op: ['{NH3 + NO -> N2 + H2O}', '{2NH3 + 3NO -> 5/2N2 + 3H2O}', '{4NH3 + 6NO -> 10N2 + 6H2O}'], a: 1, exp: 'Es la misma ecuación dividida por 2. Las otras no tienen igual número de átomos de cada lado.' },
    { t: 'bal', r: ['Fe2O3', 'C'], p: ['Fe', 'CO2'] },
    { t: 'bal', r: ['P4O10', 'H2O'], p: ['H3PO4'] },
    { t: 'bal', r: ['NH4NO3'], p: ['N2', 'H2O', 'O2'] }
  ],
  practica: ['balanceGen']
},

/* ======================= 4. pH ======================= */
{
  id: 'ph', num: 4, icon: '🍋', color: '#f59e0b',
  titulo: 'Ácidos, bases y pH',
  sub: 'Autoionización del agua, escala de pH, indicadores y neutralización',
  fuente: 'Unidad 2',
  cards: [
    {
      icon: '💧', title: 'Autoionización del agua',
      body: `El agua pura se ioniza muy poquito:`,
      html: `<div class="eq-big">{2H2O <=> H3O^+ + OH^-}</div><p class="center small">K<sub>w</sub> = 1 × 10<sup>-14</sup></p>`,
      list: ['**Neutra**: hay igual cantidad de cationes {H3O^+} (hidronio) y aniones {OH^-} (oxhidrilo).', '**Ácida**: una sustancia aporta {H3O^+} → aumenta la **acidez**.', '**Básica**: una sustancia aporta {OH^-} → aumenta la **alcalinidad**.']
    },
    {
      icon: '📏', title: 'La escala de pH',
      body: `El **pH** es el “menos logaritmo en base 10” de la concentración de iones hidronio:`,
      html: `<div class="formula-box">pH = − log [H<sub>3</sub>O<sup>+</sup>]</div>
      <div class="ph-bar"><span style="flex:7">ÁCIDO (pH &lt; 7)</span><span style="flex:1">7</span><span style="flex:7">BÁSICO (pH &gt; 7)</span></div>`,
      example: { title: 'Ejemplos de cálculo', lines: ['[H₃O⁺] = 10^-3 M → pH = 3 (ácido)', '[H₃O⁺] = 10^-7 M → pH = 7 (neutro)', '[H₃O⁺] = 10^-11 M → pH = 11 (básico)'] },
      tip: 'Cada unidad de pH es **10 veces** más ácido o básico. pH 3 es 10 veces más ácido que pH 4, y 100 veces más ácido que pH 5.'
    },
    {
      icon: '🧃', title: 'pH de cosas cotidianas',
      html: `<div class="ph-list">
        <div><b>1–2</b> Jugo gástrico</div><div><b>2</b> Jugo de limón</div><div><b>3</b> Vinagre, gaseosa</div>
        <div><b>5</b> Café</div><div><b>6,5</b> Leche</div><div><b>7</b> Agua pura</div>
        <div><b>7,4</b> Sangre</div><div><b>8,3</b> Bicarbonato</div><div><b>10</b> Jabón, leche de magnesia</div>
        <div><b>11</b> Amoníaco</div><div><b>12,5</b> Lavandina</div><div><b>14</b> Soda cáustica (NaOH)</div>
      </div>`,
      tip: 'Probalo en el 🔬 Laboratorio → “Repollo morado”.'
    },
    {
      icon: '🥬', title: 'Indicadores de pH',
      body: `Un **indicador** es una sustancia cuya estructura química **cambia según el medio**: muestra un color en medio ácido y otro en medio básico.\n\n{HInd <=> H^+ + Ind^-}\nHInd: forma ácida · Ind⁻: forma básica\n\nEl **repollo morado** contiene **antocianina**, un colorante natural que funciona como indicador. Para medir con precisión se usa un **pHmetro**.`,
      html: `<div class="cabbage-strip">${[1,2,3,4,5,6,7,8,9,10,11,12,13,14].map(n => `<span data-ph="${n}">${n}</span>`).join('')}</div>`
    },
    {
      icon: '🤝', title: 'Neutralización y sales',
      body: `**Ácido + base → sal + agua**. El {H^+} del ácido y el {OH^-} de la base forman agua; el resto forma la sal.`,
      example: { title: 'Sales binarias y ternarias', lines: ['{HCl + NaOH -> NaCl + H2O} → sal **binaria** (2 elementos)', '{H2SO4 + 2NaOH -> Na2SO4 + 2H2O} → sal **ternaria** (3 elementos)', '{HNO3 + KOH -> KNO3 + H2O} → nitrato de potasio'] },
      tip: 'Los hidrácidos (HCl, H₂S) dan sales binarias. Los oxoácidos (H₂SO₄, HNO₃) dan sales ternarias (oxosales).'
    }
  ],
  ejercicios: [
    { t: 'num', q: 'Si [{H3O^+}] = 10^-5 M, ¿cuál es el pH?', a: 5, tol: 0, exp: 'pH = −log(10⁻⁵) = 5. Es ácido.' },
    { t: 'num', q: 'Si [{H3O^+}] = 10^-9 M, ¿cuál es el pH?', a: 9, tol: 0, exp: 'pH = −log(10⁻⁹) = 9. Es básico.' },
    { t: 'mc', q: 'Una solución con pH = 7 es…', op: ['Ácida', 'Neutra', 'Básica', 'Imposible'], a: 1 },
    { t: 'mc', q: 'La lavandina tiene pH ≈ 12,5. Es…', op: ['Ácida', 'Neutra', 'Básica (alcalina)'], a: 2 },
    { t: 'num', q: '¿Cuántas veces más ácida es una solución de pH 2 que una de pH 4?', a: 100, tol: 0, unit: 'veces', hint: 'Cada unidad de pH es un factor 10.', exp: 'Hay 2 unidades de diferencia: 10 × 10 = 100 veces.' },
    { t: 'tf', q: 'Una sustancia ácida aumenta la concentración de {OH^-} en el agua.', a: false, exp: 'Los ácidos aportan H₃O⁺. Las bases aportan OH⁻.' },
    { t: 'mc', q: 'En el indicador de repollo morado, un medio muy ácido se ve…', op: ['Rojo', 'Violeta', 'Verde', 'Amarillo'], a: 0, exp: 'Ácido fuerte: rojo. Neutro: violeta. Básico: azul-verde. Muy básico: amarillo.' },
    { t: 'mc', q: '¿Qué productos da {HCl + KOH}?', op: ['{KCl + H2O}', '{KH + ClOH}', '{K + Cl2 + H2O}', '{KClO + H2}'], a: 0, exp: 'Neutralización: ácido + base → sal (KCl) + agua.' },
    { t: 'bal', r: ['H2SO4', 'NaOH'], p: ['Na2SO4', 'H2O'] },
    { t: 'mc', q: '{H2SO4 + Ca(OH)2 -> CaSO4 + 2H2O}. La sal formada es…', op: ['Binaria', 'Ternaria'], a: 1, exp: 'CaSO₄ tiene 3 elementos (Ca, S, O): sal ternaria (oxosal).' },
    { t: 'match', q: 'Uní cada sustancia con su carácter', pairs: [['Jugo de limón', 'Ácido'], ['Agua pura', 'Neutro'], ['Soda cáustica', 'Muy básico'], ['Vinagre', 'Ácido débil'], ['Bicarbonato', 'Levemente básico']] },
    { t: 'mc', q: 'La sustancia que le da color al repollo morado y funciona como indicador es la…', op: ['Clorofila', 'Antocianina', 'Fenolftaleína', 'Hemoglobina'], a: 1 }
  ],
  practica: ['phGen']
},

/* ======================= 5. NOMENCLATURA ======================= */
{
  id: 'nomenclatura', num: 5, icon: '🏷️', color: '#10b981',
  titulo: 'Números de oxidación y nomenclatura',
  sub: 'Reglas, óxidos, hidruros, hidróxidos, oxoácidos, iones y oxosales',
  fuente: 'Libro cap. 6.2',
  cards: [
    {
      icon: '🔋', title: 'Número de oxidación',
      body: `Es un **número teórico** que da la carga que tendría un átomo si los electrones de cada enlace se asignaran al átomo **más electronegativo**.\n\nEj.: el H tiene número de oxidación **+1** en {HCl}, pero **−1** en {NaH}.`
    },
    {
      icon: '📜', title: 'Las 7 reglas',
      list: [
        '1. Un elemento libre (sin combinar) tiene número de oxidación **0**: {Fe}, {O2}, {Cl2}.',
        '2. La **suma** de los números de oxidación en una sustancia neutra es **0**; en un ion, es igual a la **carga** del ion.',
        '3. Los **metales** siempre tienen número de oxidación **positivo**.',
        '4. El **F** siempre es **−1**.',
        '5. El **H** es **+1**, excepto en hidruros metálicos ({NaH}) donde es **−1**.',
        '6. El **O** es **−2**, excepto en los peróxidos ({H2O2}) donde es **−1**.',
        '7. Un ion monoatómico tiene número de oxidación igual a su carga: {Cu^2+} → +2.'
      ]
    },
    {
      icon: '🧮', title: 'Cómo calcularlo',
      body: `Usá la regla 2: planteá la suma igualada a 0 (o a la carga del ion).`,
      steps: { title: 'Ejemplos resueltos', items: [
        '**Cl en {Cl2O}**: 2·x + 1·(−2) = 0 → x = **+1**',
        '**N en {HNO3}**: (+1) + x + 3·(−2) = 0 → x = **+5**',
        '**S en {H2SO4}**: 2·(+1) + x + 4·(−2) = 0 → x = **+6**',
        '**Mn en {MnO4^-}**: x + 4·(−2) = −1 → x = **+7**',
        '**Cr en {Cr2O7^2-}**: 2·x + 7·(−2) = −2 → x = **+6**'
      ] }
    },
    {
      icon: '🟥', title: 'Óxidos',
      body: `Combinación binaria de un elemento con **oxígeno** (número de oxidación −2). Se escribe primero el otro elemento y al final el O; se **intercambian** los números de oxidación y se simplifica.`,
      html: `<table class="tbl"><tr><th>Fórmula</th><th>Sistemática</th><th>Stock</th><th>Tradicional</th></tr>
      <tr><td>{Fe2O3}</td><td>trióxido de dihierro</td><td>óxido de hierro (III)</td><td>óxido férrico</td></tr>
      <tr><td>{FeO}</td><td>óxido de hierro</td><td>óxido de hierro (II)</td><td>óxido ferroso</td></tr>
      <tr><td>{CO2}</td><td>dióxido de carbono</td><td>óxido de carbono (IV)</td><td>—</td></tr></table>`,
      tip: 'Prefijos: mono (1), di (2), tri (3), tetra (4), penta (5)… Tradicional: -oso (menor número de oxidación), -ico (mayor).'
    },
    {
      icon: '🟦', title: 'Hidruros e hidrácidos',
      body: `**Hidruros metálicos**: metal + H (el H actúa con −1). Ej.: {FeH3} trihidruro de hierro / hidruro de hierro (III).\n\n**Hidruros no metálicos**: se escribe primero el H. Nombre: no metal terminado en **-uro** + “de hidrógeno”. Ej.: {HCl} cloruro de hidrógeno, {H2S} sulfuro de dihidrógeno.\n\n**Ácidos hidrácidos**: los hidruros de los grupos 16 y 17 disueltos en agua son ácidos, terminan en **-hídrico**:`,
      html: `<div class="chip-list"><span>{HF(ac)} ácido fluorhídrico</span><span>{HCl(ac)} ácido clorhídrico</span><span>{HBr(ac)} ácido bromhídrico</span><span>{HI(ac)} ácido yodhídrico</span><span>{H2S(ac)} ácido sulfhídrico</span></div>`
    },
    {
      icon: '🟩', title: 'Hidróxidos (bases)',
      body: `Formados por el ion **hidróxido** ({OH^-}) y un catión metálico. Fórmula general **Me(OH)ₙ**. Se nombran “hidróxido de” + metal.`,
      html: `<table class="tbl"><tr><th>Fórmula</th><th>Sistemática</th><th>Stock</th><th>Tradicional</th></tr>
      <tr><td>{Mg(OH)2}</td><td>dihidróxido de magnesio</td><td>hidróxido de magnesio</td><td>hidróxido de magnesio</td></tr>
      <tr><td>{Fe(OH)3}</td><td>trihidróxido de hierro</td><td>hidróxido de hierro (III)</td><td>hidróxido férrico</td></tr>
      <tr><td>{NaOH}</td><td>hidróxido de sodio</td><td>hidróxido de sodio</td><td>soda cáustica</td></tr></table>`
    },
    {
      icon: '🟨', title: 'Oxoácidos',
      body: `Compuestos **ternarios** H–no metal–O. Resultan de un **óxido no metálico + agua**: {N2O5 + H2O -> 2HNO3}.\n\nNomenclatura tradicional según el número de oxidación del no metal: **hipo…oso < …oso < …ico < per…ico**`,
      html: `<table class="tbl"><tr><th>Ácido</th><th>Tradicional</th><th>Stock</th></tr>
      <tr><td>{HNO2}</td><td>ácido nitroso</td><td>nitrato (III) de hidrógeno</td></tr>
      <tr><td>{HNO3}</td><td>ácido nítrico</td><td>nitrato (V) de hidrógeno</td></tr>
      <tr><td>{H2CO3}</td><td>ácido carbónico</td><td>carbonato (IV) de hidrógeno</td></tr>
      <tr><td>{H2SO3}</td><td>ácido sulfuroso</td><td>sulfato (IV) de hidrógeno</td></tr>
      <tr><td>{H2SO4}</td><td>ácido sulfúrico</td><td>sulfato (VI) de hidrógeno</td></tr>
      <tr><td>{HClO}</td><td>ácido hipocloroso</td><td>clorato (I) de hidrógeno</td></tr>
      <tr><td>{HClO2}</td><td>ácido cloroso</td><td>clorato (III) de hidrógeno</td></tr>
      <tr><td>{HClO3}</td><td>ácido clórico</td><td>clorato (V) de hidrógeno</td></tr>
      <tr><td>{HClO4}</td><td>ácido perclórico</td><td>clorato (VII) de hidrógeno</td></tr></table>`
    },
    {
      icon: '🧲', title: 'Iones y oxosales',
      body: `**Aniones**: los del ácido cambian la terminación: **-oso → -ito** y **-ico → -ato**. Ej.: ácido sulfúrico → ion **sulfato** {SO4^2-}; ácido sulfuroso → ion **sulfito** {SO3^2-}. Los monoatómicos terminan en **-uro**: {F^-} fluoruro.\n\n**Oxosales**: catión + anión poliatómico. Se **cruzan las cargas**: {Co^3+} y {SO4^2-} → {Co2(SO4)3}.`,
      html: `<table class="tbl"><tr><th>Fórmula</th><th>Stock</th><th>Tradicional</th></tr>
      <tr><td>{FeSO3}</td><td>sulfato (IV) de hierro (II)</td><td>sulfito ferroso</td></tr>
      <tr><td>{Fe2(SO3)3}</td><td>sulfato (IV) de hierro (III)</td><td>sulfito férrico</td></tr>
      <tr><td>{FeSO4}</td><td>sulfato (VI) de hierro (II)</td><td>sulfato ferroso</td></tr>
      <tr><td>{Fe2(SO4)3}</td><td>sulfato (VI) de hierro (III)</td><td>sulfato férrico</td></tr></table>`
    }
  ],
  ejercicios: [
    { t: 'num', q: '¿Cuál es el número de oxidación del Cl en {Cl2O}?', a: 1, tol: 0, exp: '2x + (−2) = 0 → x = +1' },
    { t: 'num', q: '¿Cuál es el número de oxidación del N en {HNO3}?', a: 5, tol: 0, exp: '(+1) + x + 3(−2) = 0 → x = +5' },
    { t: 'num', q: '¿Cuál es el número de oxidación del Cr en {Cr2O7^2-}?', a: 6, tol: 0, exp: '2x + 7(−2) = −2 → 2x = 12 → x = +6' },
    { t: 'num', q: '¿Cuál es el número de oxidación del Mn en {KMnO4}?', a: 7, tol: 0, exp: '(+1) + x + 4(−2) = 0 → x = +7' },
    { t: 'num', q: '¿Cuál es el número de oxidación del S en {H2SO4}?', a: 6, tol: 0, exp: '2(+1) + x + 4(−2) = 0 → x = +6' },
    { t: 'num', q: '¿Cuál es el número de oxidación del H en {NaH}? (escribí el signo)', a: -1, tol: 0, exp: 'En los hidruros metálicos el H actúa con −1.' },
    { t: 'num', q: '¿Cuál es el número de oxidación del O en el peróxido {H2O2}? (escribí el signo)', a: -1, tol: 0, exp: 'En los peróxidos el O es −1: 2(+1) + 2x = 0 → x = −1.' },
    { t: 'num', q: '¿Cuál es el número de oxidación del Fe en {Fe2O3}?', a: 3, tol: 0, exp: '2x + 3(−2) = 0 → x = +3' },
    { t: 'mc', q: '¿Cómo se llama {HNO2} (tradicional)?', op: ['Ácido nítrico', 'Ácido nitroso', 'Nitrito de hidrógeno', 'Ácido hiponitroso'], a: 1, exp: 'El N actúa con +3 (el menor de sus dos valores comunes +3/+5): terminación -oso.' },
    { t: 'mc', q: '¿Cómo se llama {Ca(OH)2}?', op: ['Óxido de calcio', 'Hidruro de calcio', 'Hidróxido de calcio', 'Carbonato de calcio'], a: 2 },
    { t: 'mc', q: '{NaClO} es el componente activo de la lavandina. Su nombre tradicional es…', op: ['Clorato de sodio', 'Hipoclorito de sodio', 'Cloruro de sodio', 'Perclorato de sodio'], a: 1, exp: 'Viene del ácido hipocloroso (HClO): -oso → -ito → hipoclorito.' },
    { t: 'mc', q: '{LiClO4} se llama…', op: ['Perclorato de litio', 'Clorato de litio', 'Clorito de litio', 'Cloruro de litio'], a: 0, exp: 'Viene del ácido perclórico (HClO₄): -ico → -ato → perclorato.' },
    { t: 'mc', q: '{Fe2(SO4)3} en nomenclatura tradicional es…', op: ['Sulfato ferroso', 'Sulfito férrico', 'Sulfato férrico', 'Sulfuro de hierro'], a: 2 },
    { t: 'formula', q: 'Escribí la fórmula del **carbonato de sodio**.', a: 'Na2CO3', hint: 'Na⁺ y CO₃²⁻: cruzá las cargas.', exp: 'Na⁺ + CO₃²⁻ → Na₂CO₃' },
    { t: 'formula', q: 'Escribí la fórmula del **hidróxido de níquel (III)**.', a: 'Ni(OH)3', exp: 'Ni³⁺ necesita 3 OH⁻ → Ni(OH)₃' },
    { t: 'formula', q: 'Escribí la fórmula del **nitrato (III) de sodio** (nitrito de sodio).', a: 'NaNO2', exp: 'N con +3 → anión nitrito NO₂⁻ → NaNO₂' },
    { t: 'formula', q: 'Escribí la fórmula del **óxido de hierro (III)**.', a: 'Fe2O3', exp: 'Fe³⁺ y O²⁻: se intercambian → Fe₂O₃' },
    { t: 'match', q: 'Uní cada hidrácido con su nombre', pairs: [['{HF(ac)}', 'Ácido fluorhídrico'], ['{HCl(ac)}', 'Ácido clorhídrico'], ['{HBr(ac)}', 'Ácido bromhídrico'], ['{H2S(ac)}', 'Ácido sulfhídrico']] }
  ],
  practica: ['oxGen']
},

/* ======================= 6. EL MOL ======================= */
{
  id: 'mol', num: 6, icon: '🧮', color: '#3b82f6',
  titulo: 'El mol y la masa molar',
  sub: 'u.m.a., número de Avogadro y conversiones gramos ⇄ moles ⇄ partículas',
  fuente: 'Unidad 4',
  cards: [
    {
      icon: '⚛️', title: 'Unidad de masa atómica (u.m.a.)',
      body: `Casi toda la masa del átomo está en su **núcleo** (protones + neutrones, que tienen masas prácticamente iguales).\n\nPara armar una escala de masas atómicas relativas se toma como referencia el **carbono-12** (6 protones + 6 neutrones = 12 partículas):`,
      html: `<div class="formula-box">1 u = 1/12 de la masa de 1 átomo de <sup>12</sup>C = 1,66054 × 10<sup>-24</sup> g</div>`,
      example: { title: 'Ejemplos', lines: ['1 átomo de He = 4 u', '1 molécula de {H2O} = 2 × 1 u + 16 u = 18 u'] }
    },
    {
      icon: '🥚', title: 'El mol',
      body: `Es una de las 7 unidades fundamentales del SI. Un **mol** contiene exactamente **6,02214076 × 10^23** entidades elementales: el **número de Avogadro (N**ₐ**)**.`,
      html: `<div class="formula-box big">1 mol = 6,02 × 10<sup>23</sup> partículas</div>`,
      tip: 'Igual que “1 docena = 12”, “1 mol = 6,02 × 10²³”. Siempre hay que especificar de qué partículas: átomos, moléculas, iones, electrones…',
      fact: 'Si juntaras 1 mol de granos de arena, cubrirías toda la Argentina con una capa de varios metros de altura.'
    },
    {
      icon: '⚖️', title: 'Masa molar',
      body: `Para saber cuánto pesa **1 mol**, se usa la masa atómica (en u) **expresada en gramos**.`,
      html: `<table class="tbl"><tr><th></th><th>En u.m.a.</th><th>En moles</th></tr>
      <tr><td>Átomo de He</td><td>4 u</td><td>1 mol He = 4 g = N<sub>A</sub> átomos</td></tr>
      <tr><td>Molécula de {H2O}</td><td>18 u</td><td>1 mol {H2O} = 18 g = N<sub>A</sub> moléculas</td></tr></table>`,
      steps: { title: 'Ejemplo: masa molar del {Na3PO4}', items: [
        'Contá los átomos: 3 Na, 1 P, 4 O',
        'Multiplicá por las masas: 3 × 23 + 1 × 31 + 4 × 16',
        '69 + 31 + 64 = **164 g/mol**'
      ] }
    },
    {
      icon: '🗺️', title: 'El mapa de conversiones',
      html: `<div class="conv-map">
        <div class="node">Gramos (m)</div>
        <div class="edge">÷ M<br><small>× M</small></div>
        <div class="node main">MOLES (n)</div>
        <div class="edge">× N<sub>A</sub><br><small>÷ N<sub>A</sub></small></div>
        <div class="node">Partículas (N)</div>
      </div>
      <div class="conv-down"><div class="edge">× 22,4 L<br><small>(gas en CNPT)</small></div><div class="node">Litros de gas (V)</div></div>`,
      list: ['n = m / M', 'N = n × 6,02 × 10²³', 'V = n × 22,4 L  (solo gases a 1 atm y 273 K)'],
      tip: 'Los moles son el “centro” del mapa: casi siempre conviene pasar primero a moles.'
    },
    {
      icon: '💧', title: 'Ejemplo resuelto: 36 g de agua',
      steps: { title: '¿Cuántos moles, moléculas y átomos hay?', items: [
        'Masa molar del {H2O}: 2 × 1 + 16 = 18 g/mol',
        'Moles: n = 36 g ÷ 18 g/mol = **2 mol**',
        'Moléculas: 2 × 6,02 × 10^23 = **1,204 × 10^24 moléculas**',
        'Cada molécula tiene 3 átomos (2 H + 1 O): 3 × 1,204 × 10^24 = **3,61 × 10^24 átomos**'
      ] }
    }
  ],
  ejercicios: [
    { t: 'num', q: 'Calculá la masa molar del {H2O}.', a: 18, tol: 0.01, unit: 'g/mol' },
    { t: 'num', q: 'Calculá la masa molar del {CO2}.', a: 44, tol: 0.01, unit: 'g/mol', exp: '12 + 2 × 16 = 44 g/mol' },
    { t: 'num', q: 'Calculá la masa molar del {H2SO4}.', a: 98, tol: 0.01, unit: 'g/mol', exp: '2 × 1 + 32 + 4 × 16 = 98 g/mol' },
    { t: 'num', q: 'Calculá la masa molar del {Ca(OH)2}.', a: 74, tol: 0.01, unit: 'g/mol', hint: 'El subíndice 2 multiplica a todo lo que está dentro del paréntesis.', exp: '40 + 2 × (16 + 1) = 74 g/mol' },
    { t: 'num', q: 'Calculá la masa molar del {AgNO3} (Ag = 107,8).', a: 169.8, tol: 0.01, unit: 'g/mol', exp: '107,8 + 14 + 3 × 16 = 169,8 g/mol' },
    { t: 'num', q: '¿Cuántos moles hay en 88 g de {CO2}?', a: 2, tol: 0.01, unit: 'mol', exp: 'n = 88 g ÷ 44 g/mol = 2 mol' },
    { t: 'num', q: '¿Cuántas moléculas hay en 2 moles de {O2}? (podés escribir 1,2e24)', a: 1.204e24, tol: 0.02, unit: 'moléculas', exp: '2 × 6,02 × 10²³ = 1,204 × 10²⁴ moléculas' },
    { t: 'num', q: '¿Cuántos gramos pesan 0,5 moles de {NaCl}? (Cl = 35,5)', a: 29.25, tol: 0.02, unit: 'g', exp: 'M = 23 + 35,5 = 58,5 g/mol → 0,5 × 58,5 = 29,25 g' },
    { t: 'tf', q: '1 mol de He y 1 mol de {H2O} tienen la misma masa.', a: false, exp: '1 mol de He = 4 g y 1 mol de H₂O = 18 g. Lo que tienen igual es el NÚMERO de partículas.' },
    { t: 'tf', q: '1 mol de He y 1 mol de {H2O} tienen el mismo número de partículas.', a: true, exp: 'Ambos tienen 6,02 × 10²³ partículas (átomos de He y moléculas de agua).' },
    { t: 'multi', q: 'Completá el cuadro del {Cl2O3}:', fields: [
      { l: '1 mol de sustancia = … g', a: 119, tol: 0.01 },
      { l: 'moles de átomos de **hierro** en 1 mol de {Cl2O3}', a: 0, tol: 0 },
      { l: 'moles de átomos de oxígeno en 1 mol de {Cl2O3}', a: 3, tol: 0 },
      { l: 'átomos de cloro en UNA molécula', a: 2, tol: 0 },
      { l: 'átomos totales por molécula', a: 5, tol: 0 },
      { l: 'átomos de oxígeno en un mol de sustancia', a: 1.806e24, tol: 0.02 }
    ], hint: '¡Ojo! Una de las preguntas es trampa: ¿hay hierro en el Cl₂O₃?', exp: 'M = 2 × 35,5 + 3 × 16 = 119 g. Hierro: 0 (¡no tiene Fe!). Oxígeno: 3 moles → 3 × 6,02 × 10²³ = 1,806 × 10²⁴ átomos. 2 átomos de Cl y 5 átomos en total por molécula.' },
    { t: 'num', q: '¿Cuántos átomos de hidrógeno hay en 1 mol de {CH4}? (podés escribir 2,4e24)', a: 2.408e24, tol: 0.02, exp: '1 mol CH₄ tiene 4 moles de átomos de H: 4 × 6,02 × 10²³ = 2,41 × 10²⁴' }
  ],
  practica: ['masaMolar', 'gramosAMoles', 'molesAGramos', 'molesAParticulas']
},

/* ======================= 7. ESTEQUIOMETRÍA ======================= */
{
  id: 'esteq', num: 7, icon: '🔥', color: '#ef4444',
  titulo: 'Estequiometría: masas y volúmenes',
  sub: 'Las 3 etapas, volumen molar 22,4 L y ecuación de los gases',
  fuente: 'Unidad 4 · Libro cap. 6.3',
  cards: [
    {
      icon: '📐', title: '¿Qué es la estequiometría?',
      body: `Es el estudio de las **relaciones cuantitativas** entre las cantidades de reactivos y productos en una reacción química.\n\n⚠️ **Cualquier cálculo debe hacerse sobre una ecuación balanceada.**`,
      list: ['Cálculos de **masas**', 'Cálculos de **volúmenes**', '**Reactivo limitante**', '**Fórmulas** empíricas y moleculares']
    },
    {
      icon: '🔍', title: 'Leer una ecuación en masas',
      html: `<div class="eq-big">{2Na(s) + 2H2O(l) -> 2NaOH(ac) + H2(g)}</div>
      <table class="tbl"><tr><th></th><th>{2Na}</th><th>{2H2O}</th><th>{2NaOH}</th><th>{H2}</th></tr>
      <tr><td>Micro</td><td>2 átomos</td><td>2 moléculas</td><td>2 unidades</td><td>1 molécula</td></tr>
      <tr><td>Moles</td><td>2 mol</td><td>2 mol</td><td>2 mol</td><td>1 mol</td></tr>
      <tr><td>Masa</td><td>2 × 23 = 46 g</td><td>2 × 18 = 36 g</td><td>2 × 40 = 80 g</td><td>1 × 2 = 2 g</td></tr></table>
      <p class="center"><b>46 g + 36 g = 82 g = 80 g + 2 g</b> ✅ ¡Se conserva la masa!</p>`
    },
    {
      icon: '🪜', title: 'Las 3 etapas',
      html: `<div class="etapas">
        <div class="node">Gramos de A</div><div class="edge">Etapa 1<br><small>÷ masa molar A</small></div>
        <div class="node main">Moles de A</div><div class="edge">Etapa 2<br><small>× coef B / coef A</small></div>
        <div class="node main">Moles de B</div><div class="edge">Etapa 3<br><small>× masa molar B</small></div>
        <div class="node">Gramos de B</div></div>`,
      body: `La **clave** de los cálculos estequiométricos es el **mol**. El paso 2 (comparar coeficientes) **nunca** se puede saltear.`,
      steps: { title: 'Ejemplo: gramos de {NO2} con 100 g de {NO} — {2NO + O2 -> 2NO2}', items: [
        'Etapa 1: 100 g NO ÷ 30 g/mol = 3,33 mol NO',
        'Etapa 2: 3,33 mol NO × (2 mol NO₂ / 2 mol NO) = 3,33 mol NO₂',
        'Etapa 3: 3,33 mol × 46 g/mol = **153,3 g de NO₂**'
      ] }
    },
    {
      icon: '🎈', title: 'Cálculos con volúmenes',
      body: `**Ley de Avogadro**: volúmenes iguales de gases diferentes, en las mismas condiciones, tienen la misma cantidad de partículas.`,
      html: `<div class="formula-box">p · V = n · R · T  &nbsp;&nbsp; <small>R = 0,082 atm·L/(mol·K)</small></div>
      <div class="formula-box big">En CNPT (1 atm y 273 K): 1 mol de gas ocupa 22,4 L</div>`,
      list: ['Solo se aplica a sustancias en estado **gaseoso** (no a sólidos ni líquidos).', 'La relación de **volúmenes** entre gases es la misma que la de los **coeficientes**: {2NO + O2 -> 2NO2} → 2 L + 1 L → 2 L.', 'El volumen NO se conserva como la masa: 3 L de reactivos dieron 2 L de producto.']
    },
    {
      icon: '🔥', title: 'Ejemplo completo: metano (todos gases)',
      html: `<div class="eq-big">{CH4 + 2O2 -> CO2 + 2H2O}</div>
      <table class="tbl"><tr><th></th><th>{CH4}</th><th>{2O2}</th><th>{CO2}</th><th>{2H2O}</th></tr>
      <tr><td>Masa</td><td>16 g</td><td>2 × 32 = 64 g</td><td>44 g</td><td>2 × 18 = 36 g</td></tr>
      <tr><td>Volumen</td><td>22,4 L</td><td>44,8 L</td><td>22,4 L</td><td>44,8 L</td></tr>
      <tr><td>Moléculas</td><td>6,02×10<sup>23</sup></td><td>1,2×10<sup>24</sup></td><td>6,02×10<sup>23</sup></td><td>1,2×10<sup>24</sup></td></tr></table>`
    },
    {
      icon: '🚀', title: 'Ejemplo resuelto: el diborano',
      body: `El diborano ({B2H6}) se propuso como combustible para naves espaciales:\n{B2H6(g) + 3O2(g) -> B2O3(s) + 3H2O(g)}`,
      steps: { title: 'a) Moles de B₂H₆ para formar 12 mol de agua · b) moléculas de O₂ para 2×10²⁵ moléculas de B₂H₆', items: [
        'a) Relación: 1 mol B₂H₆ → 3 mol H₂O',
        'a) 12 mol H₂O × (1 mol B₂H₆ / 3 mol H₂O) = **4 mol de B₂H₆**',
        'b) Relación: 1 molécula B₂H₆ reacciona con 3 moléculas O₂',
        'b) 2,0 × 10^25 × 3 = **6,0 × 10^25 moléculas de O₂**'
      ] }
    },
    {
      icon: '🧪', title: 'Ejemplo resuelto: la prueba Marsh',
      body: `Para detectar arsénico se descompone la arsina: {2AsH3(g) -> 2As(s) + 3H2(g)}\n¿Cuántos g de As y qué volumen de {H2} se obtienen con 22 mL de {AsH3} en CNPT?`,
      steps: { title: 'Volumen A → moles A → moles B → gramos B', items: [
        '22 mL = 0,022 L → 0,022 L ÷ 22,4 L/mol = 0,000982 mol AsH₃',
        'Por coeficientes 2 : 2 → 0,000982 mol As',
        '0,000982 mol × 74,92 g/mol = **0,074 g de As**',
        'Entre gases, relación de volúmenes = coeficientes: 0,022 L × 3/2 = **0,033 L de H₂**'
      ] }
    }
  ],
  ejercicios: [
    { t: 'num', q: 'En {2Na + 2H2O -> 2NaOH + H2}, ¿cuántos gramos de {H2} se forman con 46 g de Na?', a: 2, tol: 0.02, unit: 'g', exp: '46 g Na = 2 mol → 1 mol H₂ = 2 g' },
    { t: 'num', q: 'En {2NO + O2 -> 2NO2}, ¿cuántos gramos de {NO2} se obtienen con 100 g de {NO}?', a: 153.3, tol: 0.02, unit: 'g', steps: ['100 g ÷ 30 g/mol = 3,333 mol NO', '× 2/2 = 3,333 mol NO₂', '× 46 g/mol = 153,3 g'] },
    { t: 'num', q: 'Con la reacción del diborano {B2H6 + 3O2 -> B2O3 + 3H2O}: ¿cuántos moles de {B2H6} se necesitan para formar 12 moles de agua?', a: 4, tol: 0.01, unit: 'mol' },
    { t: 'num', q: 'En la estratósfera: {3O2 -> 2O3}. ¿Cuántas moléculas de {O2} deben romperse para formar 10^24 moléculas de {O3}?', a: 1.5e24, tol: 0.02, unit: 'moléculas', exp: '10²⁴ × 3/2 = 1,5 × 10²⁴ moléculas de O₂' },
    { t: 'num', q: '¿Cuántos litros (CNPT) de {O2} se requieren para quemar completamente 20 g de carbón ({C + O2 -> CO2})?', a: 37.33, tol: 0.02, unit: 'L', steps: ['20 g C ÷ 12 g/mol = 1,667 mol C', 'Relación 1:1 → 1,667 mol O₂', '1,667 × 22,4 L = 37,3 L'] },
    { t: 'multi', q: 'Se queman 250 g de metano: {CH4 + 2O2 -> CO2 + 2H2O}', fields: [
      { l: 'a) Volumen de {CO2} en CNPT', a: 350, tol: 0.02, unit: 'L' },
      { l: 'b) Masa de agua producida', a: 562.5, tol: 0.02, unit: 'g' }
    ], steps: ['250 g ÷ 16 g/mol = 15,625 mol CH₄', 'CO₂: 15,625 mol × 22,4 L = 350 L', 'H₂O: 2 × 15,625 = 31,25 mol × 18 g/mol = 562,5 g'] },
    { t: 'num', q: '{3Mg + N2 -> Mg3N2}. ¿Qué volumen de {N2} (0 °C, 1 atm) reacciona con 12,0 g de magnesio?', a: 3.73, tol: 0.02, unit: 'L', steps: ['12 g ÷ 24 g/mol = 0,5 mol Mg', '× 1/3 = 0,1667 mol N₂', '× 22,4 L = 3,73 L'] },
    { t: 'num', q: '{Zn + H2SO4 -> ZnSO4 + H2}. ¿Qué volumen de {H2} (1 atm, 0 °C) se produce con 8 g de cinc (Zn = 65,4)?', a: 2.74, tol: 0.02, unit: 'L', steps: ['8 g ÷ 65,4 g/mol = 0,1223 mol Zn', 'Relación 1:1 → 0,1223 mol H₂', '× 22,4 = 2,74 L'] },
    { t: 'tf', q: 'La ecuación p·V = n·R·T sirve también para sólidos y líquidos.', a: false, exp: 'Solo es válida para gases.' },
    { t: 'tf', q: 'En {2NO(g) + O2(g) -> 2NO2(g)}, 2 L de {NO} reaccionan con 1 L de {O2} y dan 2 L de {NO2}.', a: true, exp: 'Entre gases, la relación de volúmenes es la misma que la de coeficientes.' },
    { t: 'mc', q: 'Para {N2(g) + 3H2(g) -> 2NH3(g)}, ¿cuál afirmación es correcta?', op: ['1 L de {N2} reacciona con 3 L de {H2} y da 2 L de {NH3}', '1 g de {N2} reacciona con 3 g de {H2} y da 2 g de {NH3}', '1 mol de {N2} con 3 mol de {H2} da 4 mol de {NH3}'], a: 0, exp: 'Los coeficientes indican proporción de moles y, entre gases, de volúmenes; NUNCA de gramos. Y se forman 2 mol de NH₃, no 4 (los moles no se conservan, la masa sí).' }
  ],
  practica: ['estequiometriaMasa', 'molesAVolumen', 'gramosAMoles']
},

/* ======================= 8. LIMITANTE ======================= */
{
  id: 'limitante', num: 8, icon: '🍞', color: '#f97316',
  titulo: 'Reactivo limitante y en exceso',
  sub: '¿Quién se termina primero? Tablas de inicio, reacción y final',
  fuente: 'Unidad 4 · Libro cap. 6.4',
  cards: [
    {
      icon: '🍞', title: 'La analogía de las tostadas',
      body: `Por mucha mermelada que tengas, con **4 rebanadas de pan** no podés preparar más de **4 tostadas con mermelada**.\n\nEl pan es el **reactivo limitante**: cuando se termina, se termina la “reacción”. La mermelada sobra: es el **reactivo en exceso**.`,
      html: `<div class="toast-demo">🍞🍞🍞🍞 + 🍯🍯🍯🍯🍯🍯 → 🥪🥪🥪🥪 + <span class="sobra">🍯🍯 sobran</span></div>`
    },
    {
      icon: '📕', title: 'Definiciones',
      body: `**Reactivo limitante**: el que está en **menor** proporción a la que corresponde por estequiometría. Cuando se consume, la reacción **se detiene**. **Determina** la cantidad de producto que se forma.\n\n**Reactivo en exceso**: el que está en **mayor** proporción a la necesaria. **No se consume completamente.**`,
      tip: 'El cálculo de producto SIEMPRE se hace a partir del reactivo limitante.'
    },
    {
      icon: '🫙', title: 'Ejemplo visual',
      body: `{2NO(g) + O2(g) -> 2NO2(g)} — mezclamos **2 mol de NO** con **2 mol de O₂**:`,
      html: `<table class="tbl"><tr><th></th><th>{NO}</th><th>{O2}</th><th>{NO2}</th></tr>
      <tr><td>Inicio</td><td>2 mol</td><td>2 mol</td><td>0 mol</td></tr>
      <tr><td>Reaccionan</td><td>−2 mol</td><td>−1 mol</td><td>+2 mol</td></tr>
      <tr class="final"><td>Final</td><td>0 (limitante)</td><td>1 mol (exceso)</td><td>2 mol</td></tr></table>`,
      tip: 'Probalo vos en el 🔬 Laboratorio → “Reactor”: elegís cuántas moléculas ponés y ves qué sobra.'
    },
    {
      icon: '🧭', title: 'Cómo encontrar el limitante',
      list: ['1️⃣ Balanceá la ecuación.', '2️⃣ Pasá las cantidades de cada reactivo a **moles**.', '3️⃣ Dividí los moles de cada reactivo por su **coeficiente**. El que da el número **más chico** es el **limitante**.', '   (Otra forma: calculá cuánto producto daría cada reactivo; el que da MENOS es el limitante).', '4️⃣ Con el limitante calculá los productos y cuánto se gasta del otro.', '5️⃣ Exceso que queda = lo que había − lo que reaccionó.']
    },
    {
      icon: '🥈', title: 'Ejemplo resuelto: fosfato de plata',
      body: `100 g de cada reactivo: {Na3PO4 + AgNO3 -> Ag3PO4 + NaNO3}`,
      steps: { title: 'Paso a paso', items: [
        'Balanceo: {Na3PO4 + 3AgNO3 -> Ag3PO4 + 3NaNO3}',
        'Masas molares: Na₃PO₄ = 164 g/mol · AgNO₃ = 169,8 g/mol',
        'Moles: 100/164 = **0,61 mol Na₃PO₄** · 100/169,8 = **0,59 mol AgNO₃**',
        'Se necesita proporción 1 a 3. Divido por coeficientes: 0,61/1 = 0,61 · 0,59/3 = 0,197 → **AgNO₃ es el limitante**',
        'Reacciona: 0,59/3 = 0,19 mol Na₃PO₄. Queda en exceso: 0,61 − 0,19 = **0,41 mol Na₃PO₄**',
        'Productos: 0,19 mol Ag₃PO₄ × 418,4 g/mol = **79,5 g** · 0,59 mol NaNO₃ × 85 g/mol = **50,15 g**'
      ] }
    },
    {
      icon: '🥤', title: 'Ejemplo resuelto: ácido fosfórico (gaseosas)',
      body: `El ácido fosfórico (aditivo E-338 de las colas) se obtiene así: {P4O10(s) + 6H2O(l) -> 4H3PO4(ac)}\nSe mezclan 256,0 g de {P4O10} con 422,0 g de agua.`,
      steps: { title: 'Calculo el producto con cada reactivo', items: [
        'Si el limitante fuera el P₄O₁₀: 256 g ÷ 283,88 g/mol × 4 × 97,99 g/mol = **353,5 g** de H₃PO₄',
        'Si el limitante fuera el H₂O: 422 g ÷ 18,016 g/mol × 4/6 × 97,99 g/mol = **1530,2 g** de H₃PO₄',
        'El menor valor gana: **P₄O₁₀ es el limitante** y se forman **353,5 g** de H₃PO₄.'
      ] }
    }
  ],
  ejercicios: [
    { t: 'multi', q: '{CH4 + 2O2 -> CO2 + 2H2O}. Se tiene 1 mol de {CH4} y 1 mol de {O2}.', fields: [
      { l: 'Moles de {CH4} que quedan en exceso', a: 0.5, tol: 0.02, unit: 'mol' },
      { l: 'Moles de {CO2} formados', a: 0.5, tol: 0.02, unit: 'mol' },
      { l: 'Moles de {H2O} formados', a: 1, tol: 0.02, unit: 'mol' }
    ], hint: 'Dividí moles por coeficiente: CH₄ 1/1 = 1 y O₂ 1/2 = 0,5.', exp: 'El O₂ es el limitante: 1 mol O₂ reacciona con 0,5 mol CH₄. Sobran 0,5 mol CH₄ y se forman 0,5 mol CO₂ y 1 mol H₂O.' },
    { t: 'mc', q: 'En ese mismo caso (1 mol CH₄ + 1 mol O₂), ¿cuál es el reactivo limitante?', op: ['{CH4}', '{O2}', 'Ninguno'], a: 1 },
    { t: 'multi', q: '¿Cuántos litros de {NH3} (CNPT) se producen al mezclar 14 g de {N2} y 6 g de {H2}? {N2 + 3H2 -> 2NH3}', fields: [
      { l: 'Moles de {N2}', a: 0.5, tol: 0.02, unit: 'mol' },
      { l: 'Moles de {H2}', a: 3, tol: 0.02, unit: 'mol' },
      { l: 'Litros de {NH3}', a: 22.4, tol: 0.02, unit: 'L' }
    ], steps: ['N₂: 14/28 = 0,5 mol → 0,5/1 = 0,5', 'H₂: 6/2 = 3 mol → 3/3 = 1', 'Limitante: N₂ (0,5 < 1)', 'NH₃: 0,5 × 2 = 1 mol → 22,4 L'] },
    { t: 'multi', q: 'Se mezclaron 20 L de {H2} y 20 L de {O2} (CNPT). ¿Cuánta agua se obtuvo? {2H2 + O2 -> 2H2O}', fields: [
      { l: 'Moles de agua', a: 0.893, tol: 0.02, unit: 'mol' },
      { l: 'Gramos de agua', a: 16.07, tol: 0.02, unit: 'g' }
    ], steps: ['H₂: 20/22,4 = 0,893 mol → /2 = 0,446', 'O₂: 20/22,4 = 0,893 mol → /1 = 0,893', 'Limitante: H₂', 'H₂O: 0,893 mol × 18 g/mol = 16,07 g'] },
    { t: 'mc', q: '100 g de ácido sulfhídrico ({H2S}) reaccionan con 100 g de hidróxido de plata ({AgOH}): {H2S + 2AgOH -> Ag2S + 2H2O}. ¿Cuál es el limitante?', op: ['{H2S}', '{AgOH}', 'Ninguno, están en proporción exacta'], a: 1, steps: ['H₂S: 100/34 = 2,94 mol → /1 = 2,94', 'AgOH (124,8 g/mol): 100/124,8 = 0,80 mol → /2 = 0,40', 'El menor es AgOH → limitante. H₂S en exceso.'] },
    { t: 'num', q: 'En el ejercicio anterior, ¿cuántos moles de sal ({Ag2S}) se obtienen?', a: 0.4, tol: 0.03, unit: 'mol', exp: '0,80 mol AgOH × (1 mol Ag₂S / 2 mol AgOH) = 0,40 mol Ag₂S' },
    { t: 'num', q: '¿Cuántos gramos de óxido ferroso se obtienen con 60 g de hierro y 22,4 L de {O2}? {2Fe + O2 -> 2FeO}', a: 77.14, tol: 0.02, unit: 'g', steps: ['Fe: 60/56 = 1,071 mol → /2 = 0,536', 'O₂: 22,4 L = 1 mol → /1 = 1', 'Limitante: Fe', 'FeO: 1,071 mol × 72 g/mol = 77,1 g'] },
    { t: 'multi', q: 'Se mezclan 20,0 g de {NH3} con 20,0 g de {HCl}: {NH3 + HCl -> NH4Cl}', fields: [
      { l: 'Gramos de {NH4Cl} formados', a: 29.3, tol: 0.02, unit: 'g' },
      { l: 'Gramos de {NH3} que sobran', a: 10.68, tol: 0.03, unit: 'g' }
    ], steps: ['NH₃: 20/17 = 1,176 mol · HCl: 20/36,5 = 0,548 mol', 'Limitante: HCl', 'NH₄Cl: 0,548 × 53,5 = 29,3 g', 'Sobra NH₃: (1,176 − 0,548) × 17 = 10,7 g'] },
    { t: 'multi', q: 'Alto horno: {2Fe2O3 + 3C -> 4Fe + 3CO2}. Se dispone de 30 kg de óxido y 5 kg de carbono.', fields: [
      { l: 'Kilogramos de hierro obtenidos', a: 21, tol: 0.02, unit: 'kg' }
    ], hint: 'Trabajá en kg y kmol, es igual que con g y mol.', steps: ['Fe₂O₃: 30 000 g / 160 = 187,5 mol → /2 = 93,75', 'C: 5000 / 12 = 416,7 mol → /3 = 138,9', 'Limitante: Fe₂O₃ (el C está en exceso)', 'Fe: 187,5 × 4/2 = 375 mol × 56 = 21 000 g = 21 kg'] },
    { t: 'multi', q: '{Cr2O3(s) + 2Al(s) -> Al2O3(s) + 2Cr(s)}. Se mezclan 16,4 g de Al con 33,0 g de {Cr2O3}.', fields: [
      { l: 'Gramos de cromo obtenidos', a: 22.58, tol: 0.02, unit: 'g' },
      { l: 'Moles del reactivo en exceso que quedan', a: 0.173, tol: 0.04, unit: 'mol' }
    ], steps: ['Al: 16,4/27 = 0,607 mol → /2 = 0,304', 'Cr₂O₃ (152 g/mol): 33/152 = 0,217 mol → /1 = 0,217', 'Limitante: Cr₂O₃', 'Cr: 0,217 × 2 = 0,434 mol × 52 = 22,6 g', 'Al que reacciona: 0,434 mol → sobra 0,607 − 0,434 = 0,173 mol'] },
    { t: 'tf', q: 'El reactivo limitante es siempre el que tiene menos gramos.', a: false, exp: '¡No! Depende de los MOLES y de los coeficientes. En el ejemplo del fosfato de plata había 100 g de cada uno y el limitante fue el AgNO₃.' }
  ],
  practica: ['limitanteGen']
},

/* ======================= 9. RENDIMIENTO Y SOLUCIONES ======================= */
{
  id: 'rendimiento', num: 9, icon: '📈', color: '#14b8a6',
  titulo: 'Rendimiento y soluciones',
  sub: 'Rendimiento teórico, real y porcentual · Molaridad',
  fuente: 'Libro cap. 6.5 y 6.6',
  cards: [
    {
      icon: '📉', title: '¿Por qué no se obtiene todo?',
      body: `La cantidad calculada con la ecuación es el **rendimiento teórico** (lo que se obtendría si la reacción fuera perfecta). En la práctica, la **cantidad real** casi siempre es **menor** porque:`,
      list: ['La reacción puede detenerse antes de agotar los reactivos.', 'Hay reacciones que compiten y forman otros productos (subproductos).', 'Los reactivos no son completamente puros.', 'Se pierde algo al separar y purificar el producto.']
    },
    {
      icon: '💯', title: 'Rendimiento porcentual',
      html: `<div class="formula-box big">Rendimiento (%) = <span class="frac"><span>cantidad obtenida (real)</span><span>cantidad teórica</span></span> × 100</div>`,
      tip: 'Siempre calculá primero el teórico a partir del reactivo limitante. El rendimiento nunca debería superar el 100 %.'
    },
    {
      icon: '🏆', title: 'Ejemplo resuelto: el Nobel del diborano',
      body: `Herbert C. Brown ganó el Nobel en 1979 por su trabajo con el diborano:\n{3NaBH4 + 4BF3 -> 3NaBF4 + 2B2H6}\nCon 37,80 g de {NaBH4} y exceso de {BF3} se aislaron 14,92 g de {B2H6}.`,
      steps: { title: 'Paso a paso', items: [
        'Teórico: 37,80 g ÷ 37,80 g/mol = 1 mol NaBH₄',
        '× 2/3 = 0,667 mol B₂H₆ × 27,62 g/mol = **18,41 g** (teórico)',
        'Rendimiento = 14,92 / 18,41 × 100 = **81,04 %**'
      ] }
    },
    {
      icon: '🧴', title: 'Molaridad (concentración molar)',
      body: `Si un reactivo está **disuelto**, para pasar a moles se usa la **molaridad** (c) y el **volumen** de la solución (en litros):`,
      html: `<div class="formula-box big">c = moles de soluto / V (L) &nbsp;⇒&nbsp; moles = c · V</div>`,
      example: { title: 'Ejemplos rápidos', lines: ['0,5 mol de NaCl en 0,250 L → c = 0,5 / 0,25 = **2 M** (2 mol/L)', '500 mL de solución 0,2 M → n = 0,2 × 0,5 = **0,1 mol**'] }
    },
    {
      icon: '🧪', title: 'Ejemplo resuelto: bismuto',
      body: `{Bi2O3(s) + 6HCl(ac) -> 2BiCl3(ac) + 3H2O(l)}\n¿Cuántos gramos de {Bi2O3} reaccionan con 250 mL de HCl 0,10 M?`,
      steps: { title: 'Volumen de solución → moles A → moles B → gramos B', items: [
        'Moles HCl = 0,10 mol/L × 0,250 L = 0,025 mol',
        'Por coeficientes: 0,025 × 1/6 = 0,004167 mol Bi₂O₃',
        'Masa molar: Bi₂O₃ = 2 × 209 + 3 × 16 = 466 g/mol → 0,004167 × 466 = **1,94 g de Bi₂O₃**',
        'Nota: el libro usa 256,98 g/mol y llega a 1,1 g, pero esa masa molar está mal calculada. Con 466 g/mol el resultado es 1,94 g.'
      ] },
      tip: 'Moraleja: siempre verificá la masa molar vos mismo/a. ¡Hasta los libros se equivocan!'
    }
  ],
  ejercicios: [
    { t: 'num', q: 'La hidracina se obtiene así: {NaOCl + 2NH3 -> N2H4 + NaCl + H2O}. Con 620,8 g de {NaOCl} (y amoníaco en exceso) se obtienen 216,2 g de {N2H4}. ¿Cuál es el rendimiento porcentual?', a: 81.08, tol: 0.015, unit: '%', steps: ['NaOCl: 23 + 16 + 35,5 = 74,5 g/mol → 620,8/74,5 = 8,333 mol', 'Relación 1:1 → 8,333 mol N₂H₄ × 32 g/mol = 266,7 g (teórico)', '216,2 / 266,7 × 100 = 81,1 %'] },
    { t: 'multi', q: 'Urea: {2NH3 + CO2 -> CO(NH2)2 + H2O}. Con exceso de amoníaco y 100 g de {CO2} se forman 108,4 g de urea.', fields: [
      { l: 'a) Rendimiento teórico', a: 136.4, tol: 0.02, unit: 'g' },
      { l: 'b) Rendimiento real', a: 108.4, tol: 0.01, unit: 'g' },
      { l: 'c) Rendimiento porcentual', a: 79.5, tol: 0.015, unit: '%' }
    ], steps: ['CO₂: 100/44 = 2,273 mol', 'Urea (60 g/mol): 2,273 × 60 = 136,4 g teórico', 'Real = 108,4 g', '108,4/136,4 × 100 = 79,5 %'] },
    { t: 'num', q: '{NCl3 + 3H2O -> NH3 + 3HClO}. ¿Cuántos gramos de {HClO} se forman con 36,0 g de {NCl3} si el rendimiento es del 92 %?', a: 43.3, tol: 0.02, unit: 'g', steps: ['NCl₃: 14 + 3 × 35,5 = 120,5 g/mol → 36/120,5 = 0,2988 mol', 'HClO: × 3 = 0,896 mol × 52,5 g/mol = 47,06 g (teórico)', '× 0,92 = 43,3 g'] },
    { t: 'num', q: '¿Cuál es la molaridad de una solución con 0,5 mol de soluto en 250 mL?', a: 2, tol: 0.01, unit: 'M', exp: 'c = 0,5 mol / 0,250 L = 2 M' },
    { t: 'num', q: '¿Cuántos moles de soluto hay en 500 mL de una solución 0,2 M?', a: 0.1, tol: 0.01, unit: 'mol' },
    { t: 'num', q: 'Tinta secreta: {Pb(NO3)2 + Na2S -> PbS + 2NaNO3}. Con 75 mL de {Na2S} 0,10 M y exceso de nitrato de plomo, ¿cuántos gramos de {PbS} se forman? (Pb = 207)', a: 1.79, tol: 0.02, unit: 'g', steps: ['n Na₂S = 0,10 × 0,075 = 0,0075 mol', 'Relación 1:1 → 0,0075 mol PbS', 'PbS = 207 + 32 = 239 g/mol → 0,0075 × 239 = 1,79 g'] },
    { t: 'tf', q: 'El rendimiento real suele ser menor que el teórico.', a: true },
    { t: 'mc', q: 'Si el rendimiento teórico es 50 g y se obtienen 40 g, el rendimiento es…', op: ['125 %', '80 %', '40 %', '10 %'], a: 1, exp: '40/50 × 100 = 80 %' }
  ],
  practica: ['rendimientoGen', 'molaridadGen']
},

/* ======================= 10. FÓRMULAS ======================= */
{
  id: 'formulas', num: 10, icon: '🧬', color: '#6366f1',
  titulo: 'Composición centesimal y fórmulas',
  sub: 'Fórmula empírica (mínima) y fórmula molecular',
  fuente: 'Unidad 4 · Libro cap. 6.7',
  cards: [
    {
      icon: '👨‍👩‍👧‍👦', title: 'Empírica vs. molecular',
      body: `**Fórmula empírica (mínima)**: la relación **más simple** de enteros entre los átomos.\n**Fórmula molecular**: la cantidad **real** de átomos en una molécula.\n\nAnalogía: en una familia hay 4 mujeres y 2 hombres. La proporción es 2 : 1 (empírica), pero el número real es 4 y 2 (molecular).`,
      html: `<table class="tbl"><tr><th>Sustancia</th><th>Molecular</th><th>Empírica</th></tr>
      <tr><td>Agua oxigenada</td><td>{H2O2}</td><td>{HO}</td></tr>
      <tr><td>Benceno</td><td>{C6H6}</td><td>{CH}</td></tr>
      <tr><td>Arsénico blanco</td><td>{As4O6}</td><td>{As2O3}</td></tr>
      <tr><td>Agua</td><td>{H2O}</td><td>{H2O}</td></tr></table>`,
      tip: 'En los compuestos iónicos la fórmula mínima coincide con la que se usa (NaCl, CaO).'
    },
    {
      icon: '🥧', title: 'Composición centesimal',
      body: `Indica el **porcentaje en masa** de cada elemento en un compuesto. Es la misma sin importar el tamaño de la muestra.`,
      html: `<div class="formula-box">% elemento = <span class="frac"><span>masa del elemento</span><span>masa total del compuesto</span></span> × 100</div>`,
      steps: { title: 'Ejemplo: óxido de cerio (IV), {CeO2} (hornos autolimpiantes)', items: [
        'Masa molar: 140,12 + 2 × 16 = 172,12 g/mol',
        '% Ce = 140,12 / 172,12 × 100 = **81,41 %**',
        '% O = 32 / 172,12 × 100 = **18,59 %**',
        'Control: 81,41 + 18,59 = 100 ✓'
      ] }
    },
    {
      icon: '🔎', title: 'Del % a la fórmula empírica',
      list: ['1️⃣ Suponé **100 g** de compuesto: cada % pasa a ser gramos.', '2️⃣ Pasá cada masa a **moles** de átomos (÷ masa atómica).', '3️⃣ **Dividí** todos por el **más chico**.', '4️⃣ Si quedan números como 1,5 o 1,33, multiplicá todo por 2 o 3 para que sean enteros.', '5️⃣ Esos enteros son los subíndices.'],
      steps: { title: 'Ejemplo: 81,41 % Ce y 18,59 % O', items: [
        '100 g → 81,41 g Ce y 18,59 g O',
        'Ce: 81,41 / 140,12 = 0,581 mol · O: 18,59 / 16 = 1,162 mol',
        'Divido por 0,581: Ce = 1 · O = 2',
        'Fórmula empírica: **{CeO2}**'
      ] }
    },
    {
      icon: '🎈', title: 'Ejemplo: la azida de sodio (airbags)',
      body: `La azida de sodio genera el gas que infla los airbags. Contiene **35,36 % de Na** y **64,64 % de N**.`,
      steps: { title: 'Calculemos', items: [
        'Na: 35,36 g / 23 = 1,537 mol · N: 64,64 g / 14 = 4,617 mol',
        'Divido por 1,537: Na = 1 · N = 3,0',
        'Fórmula empírica: **{NaN3}**',
        'Masa molar real = 65 g/mol; masa de NaN₃ = 23 + 42 = 65 → n = 1, la molecular es igual: {NaN3}'
      ] }
    },
    {
      icon: '✖️', title: 'Fórmula molecular',
      body: `La molecular es un **múltiplo** de la empírica. Se calcula con la masa molar:`,
      html: `<div class="formula-box big">n = <span class="frac"><span>masa molar del compuesto</span><span>masa de la fórmula empírica</span></span></div>`,
      steps: { title: 'Ejemplo: benceno (M = 78,11 g/mol, empírica CH)', items: [
        'Masa de CH = 12 + 1 = 13 g',
        'n = 78,11 / 13 = 6',
        'Fórmula molecular = (CH)₆ = **{C6H6}**'
      ] }
    },
    {
      icon: '🔵', title: 'Trabajo práctico: sulfato de cobre hidratado',
      body: `El {CuSO4·nH2O} (azul de vitriolo) es **azul**. Al calentarlo en un crisol pierde el agua y queda **blanco** (anhidro). Si se le agrega agua, ¡vuelve a ser azul! → sirve como **prueba para detectar agua**.`,
      list: ['Se pesa el crisol vacío (m₁) y con la muestra (m₂).', 'Se calienta hasta **masa constante** (m₃): así se asegura que salió toda el agua.', 'Masa de sal anhidra = m₃ − m₁ · Masa de agua = m₂ − m₃', 'Se pasan ambas a moles y se divide: n = moles de agua / moles de CuSO₄ → resultado: **{CuSO4·5H2O}**']
    }
  ],
  ejercicios: [
    { t: 'formula', q: 'La azida de sodio contiene 35,36 % de sodio y 64,64 % de nitrógeno. Escribí su fórmula empírica.', a: 'NaN3' },
    { t: 'formula', q: 'Una muestra de hidracina contiene 12,5 g de H y 87,5 g de N. ¿Cuál es su fórmula mínima?', a: 'NH2', steps: ['H: 12,5/1 = 12,5 mol · N: 87,5/14 = 6,25 mol', 'Divido por 6,25: H = 2 · N = 1', 'NH₂'] },
    { t: 'formula', q: 'El freón contiene 0,992 g de C, 5,88 g de Cl y 3,14 g de F. Determiná su fórmula empírica.', a: 'CCl2F2', steps: ['C: 0,992/12 = 0,0827 · Cl: 5,88/35,5 = 0,1656 · F: 3,14/19 = 0,1653', 'Divido por 0,0827: C = 1 · Cl = 2 · F = 2', 'CCl₂F₂'] },
    { t: 'formula', q: 'El oropimente (lo que los alquimistas querían convertir en oro) tiene 60,90 % de As y 39,10 % de S. ¿Su fórmula empírica?', a: 'As2S3', hint: 'Al dividir te va a quedar 1 : 1,5. Multiplicá por 2.', steps: ['As: 60,90/75 = 0,812 · S: 39,10/32 = 1,222', 'Divido por 0,812: As = 1 · S = 1,5', '× 2 → As = 2 · S = 3 → As₂S₃'] },
    { t: 'formula', q: 'La fórmula molecular del agua oxigenada es {H2O2}. ¿Cuál es su fórmula empírica?', a: 'HO' },
    { t: 'formula', q: 'Un compuesto tiene fórmula mínima {AlCl3} y masa molar 267 g. ¿Fórmula molecular?', a: 'Al2Cl6', steps: ['AlCl₃ = 27 + 3 × 35,5 = 133,5 g', 'n = 267 / 133,5 = 2', 'Al₂Cl₆'] },
    { t: 'multi', q: 'Dos compuestos tienen la misma fórmula mínima {CH}. Uno tiene masa molar 26,04 g y el otro 52,07 g. ¿Cuál es el valor de n para cada uno?', fields: [
      { l: 'n del primero (26,04 g)', a: 2, tol: 0.02 },
      { l: 'n del segundo (52,07 g)', a: 4, tol: 0.02 }
    ], exp: 'CH = 13 g. 26,04/13 = 2 → C₂H₂ (acetileno). 52,07/13 = 4 → C₄H₄.' },
    { t: 'formula', q: 'Con la fórmula mínima de la hidracina ({NH2}) y su masa molar de 32 g, determiná la fórmula molecular.', a: 'N2H4', exp: 'NH₂ = 16 g → n = 32/16 = 2 → N₂H₄' },
    { t: 'formula', q: 'El compuesto que da el color rojo a los tomates tiene fórmula empírica {C5H7} y masa molar 537 g/mol. ¿Fórmula molecular?', a: 'C40H56', steps: ['C₅H₇ = 5 × 12 + 7 = 67 g', 'n = 537/67 ≈ 8', 'C₄₀H₅₆ (licopeno)'] },
    { t: 'multi', q: 'El flúor de muchos dentífricos es difluoruro de estaño, {SnF2} (Sn = 118,7). Composición centesimal:', fields: [
      { l: '% de Sn', a: 75.75, tol: 0.01, unit: '%' },
      { l: '% de F', a: 24.25, tol: 0.02, unit: '%' }
    ], steps: ['M = 118,7 + 2 × 19 = 156,7 g/mol', '% Sn = 118,7/156,7 × 100 = 75,75 %', '% F = 38/156,7 × 100 = 24,25 %'] },
    { t: 'num', q: 'El cobre verde de las cúpulas (como la del Congreso) es {Cu2(OH)2CO3}. ¿Qué % de cobre tiene? (Cu = 63,5)', a: 57.47, tol: 0.01, unit: '%', steps: ['M = 2 × 63,5 + 2 × 17 + 12 + 3 × 16 = 221 g/mol', '% Cu = 127/221 × 100 = 57,5 %'] },
    { t: 'num', q: 'TP: una muestra de {CuSO4·nH2O} deja 3,19 g de sal anhidra y pierde 1,80 g de agua. ¿Cuánto vale n? (CuSO₄ = 159,5 g/mol)', a: 5, tol: 0.03, steps: ['CuSO₄: 3,19/159,5 = 0,02 mol', 'H₂O: 1,80/18 = 0,1 mol', 'n = 0,1/0,02 = 5 → CuSO₄·5H₂O'] },
    { t: 'tf', q: 'La composición centesimal de un compuesto depende del tamaño de la muestra.', a: false, exp: 'Cualquiera sea la cantidad de muestra, la composición centesimal es la misma.' }
  ],
  practica: ['composicionGen']
}
];

/* ======================= FICHAS (glosario) ======================= */
window.FICHAS = [
  ['Reacción química', 'Proceso en el que reactivos se transforman en productos nuevos; los átomos se reagrupan.'],
  ['Reactivos', 'Sustancias iniciales de una reacción (a la izquierda de la flecha).'],
  ['Productos', 'Sustancias nuevas que se forman (a la derecha de la flecha).'],
  ['Coeficiente estequiométrico', 'Número delante de una fórmula: indica la proporción de moléculas o moles.'],
  ['Subíndice', 'Número pequeño dentro de una fórmula: cantidad de átomos de ese elemento en la molécula. Nunca se cambia para balancear.'],
  ['Ley de conservación de la masa', 'La masa total de los reactivos es igual a la masa total de los productos.'],
  ['(ac)', 'Solución acuosa: sustancia disuelta en agua.'],
  ['Reacción reversible', 'Los productos pueden volver a formar los reactivos. Se indica con ⇄.'],
  ['Síntesis', 'A + B → C. Dos o más sustancias forman un único producto.'],
  ['Descomposición', 'A → B + C. Un reactivo se separa en varios productos.'],
  ['Sustitución simple', 'A + BC → AC + B. Un elemento reemplaza a otro en un compuesto.'],
  ['Doble sustitución', 'AB + CD → AD + CB. Dos compuestos intercambian partes.'],
  ['Neutralización', 'Ácido + base → sal + agua.'],
  ['Combustión', 'Reacción con O₂ que libera energía; los combustibles con C e H dan CO₂ + H₂O.'],
  ['Exotérmica', 'Reacción que libera calor al ambiente.'],
  ['Endotérmica', 'Reacción que absorbe calor del ambiente.'],
  ['Oxidación', 'Pérdida de electrones: el número de oxidación sube.'],
  ['Reducción', 'Ganancia de electrones: el número de oxidación baja.'],
  ['pH', '−log [H₃O⁺]. Escala de 0 a 14: < 7 ácido, 7 neutro, > 7 básico.'],
  ['Indicador', 'Sustancia que cambia de color según el pH del medio (ej.: antocianina del repollo morado).'],
  ['u.m.a.', '1/12 de la masa de un átomo de carbono-12 = 1,66 × 10⁻²⁴ g.'],
  ['Mol', 'Cantidad de sustancia que contiene 6,02 × 10²³ entidades elementales.'],
  ['Número de Avogadro', '6,02 × 10²³ partículas por mol.'],
  ['Masa molar', 'Masa de 1 mol de sustancia, en g/mol (masa atómica o molecular expresada en gramos).'],
  ['Volumen molar', 'En CNPT (1 atm, 273 K) 1 mol de cualquier gas ocupa 22,4 L.'],
  ['Estequiometría', 'Estudio de las relaciones cuantitativas entre reactivos y productos.'],
  ['Reactivo limitante', 'El que se agota primero; determina la cantidad de producto.'],
  ['Reactivo en exceso', 'El que sobra: no se consume completamente.'],
  ['Rendimiento porcentual', '(cantidad real / cantidad teórica) × 100.'],
  ['Molaridad', 'c = moles de soluto / litros de solución.'],
  ['Composición centesimal', 'Porcentaje en masa de cada elemento en un compuesto.'],
  ['Fórmula empírica', 'Relación mínima de enteros entre los átomos de un compuesto.'],
  ['Fórmula molecular', 'Número real de átomos de cada elemento en la molécula; múltiplo de la empírica.'],
  ['Número de oxidación', 'Carga teórica de un átomo si los electrones de cada enlace se asignaran al más electronegativo.'],
  ['Oxoácido', 'Compuesto ternario H–no metal–O; se forma con óxido no metálico + agua.'],
  ['Hidróxido', 'Compuesto con el ion OH⁻ y un metal. Son bases.'],
  ['-oso / -ico → -ito / -ato', 'Al pasar de ácido a anión (sal) cambia la terminación: sulfuroso → sulfito; sulfúrico → sulfato.']
];
