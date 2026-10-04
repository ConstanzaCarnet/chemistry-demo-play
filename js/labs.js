/* =========================================================
   labs.js — herramientas del laboratorio
   ========================================================= */
(function () {
  'use strict';
  const C = window.Chem;
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const n2 = x => C.numES(x, 2);
  // Texto plano con subíndices Unicode (para <option>, que no admite HTML)
  const uni = t => t.replace(/->/g, '→').replace(/([A-Za-z\)])(\d+)/g, (m, a, d) => a + d.replace(/\d/g, x => '₀₁₂₃₄₅₆₇₈₉'[x]));

  function render(box, tool, util) {
    ({ balance: labBalance, masa: labMasa, ph: labPH, reactor: labReactor, tabla: labTabla }[tool] || labBalance)(box, util);
  }

  /* ---------------- Balanceador ---------------- */
  function labBalance(box) {
    const lista = [];
    window.MUNDOS.forEach(m => m.ejercicios.forEach(e => { if (e.t === 'bal') lista.push([e.r, e.p]); }));
    window.GEN_DATA.ECUACIONES_BAL.forEach(x => lista.push(x));
    const txt = ([r, p]) => r.join(' + ') + ' -> ' + p.join(' + ');
    const unicos = Array.from(new Map(lista.map(x => [txt(x), x])).values());
    box.innerHTML = `<div class="panel">
      <h2>⚖️ Balanceador interactivo</h2>
      <p class="small">Elegí una ecuación de la lista o escribí la tuya (sin coeficientes). Usá los botones + y − para ajustar los coeficientes y mirá cómo se equilibra la balanza.</p>
      <div class="lab-grid">
        <div class="field"><label>Ecuaciones del curso</label><select class="inp" id="balSel">${unicos.map((x, k) => `<option value="${k}">${uni(txt(x))}</option>`).join('')}</select></div>
        <div class="field"><label>…o escribí la tuya</label><div class="num-row"><input class="inp" id="balTxt" placeholder="Ej: Fe + O2 -> Fe2O3" style="flex:1" spellcheck="false" maxlength="160" autocomplete="off"><button class="btn small" id="balGo">Cargar</button></div></div>
      </div>
      <div id="balErr"></div>
    </div><div id="balHolder" style="margin-top:16px"></div>`;
    const holder = $('#balHolder', box);
    const load = (r, p) => {
      window.QQ.renderExercise(holder, { t: 'bal', r, p }, {
        label: 'Laboratorio', nextLabel: 'Otra al azar 🎲',
        onNext: () => { const k = Math.floor(Math.random() * unicos.length); $('#balSel', box).value = k; load(...unicos[k]); }
      });
    };
    $('#balSel', box).addEventListener('change', e => load(...unicos[+e.target.value]));
    const custom = () => {
      const err = $('#balErr', box); err.innerHTML = '';
      try {
        const eq = C.parseEcuacion($('#balTxt', box).value);
        const r = eq.reactivos.map(x => x.formula), p = eq.productos.map(x => x.formula);
        if (!r.length || !p.length) throw new Error('Faltan reactivos o productos');
        if (!C.resolverBalance(r, p)) throw new Error('No encontré coeficientes posibles (¿la ecuación tiene los mismos elementos de cada lado?)');
        load(r, p);
      } catch (e) { err.innerHTML = `<div class="feedback bad">⚠️ ${C.esc(e.message)}</div>`; }
    };
    $('#balGo', box).addEventListener('click', custom);
    $('#balTxt', box).addEventListener('keydown', e => { if (e.key === 'Enter') custom(); });
    load(...unicos[0]);
  }

  /* ---------------- Masa molar y conversor ---------------- */
  function labMasa(box) {
    box.innerHTML = `<div class="lab-grid">
      <div class="panel">
        <h2>🧮 Calculadora de masa molar</h2>
        <div class="field"><label>Fórmula</label><input class="inp" id="mmF" value="H2SO4" spellcheck="false" maxlength="60" autocomplete="off" placeholder="Ej: Ca(OH)2, CuSO4·5H2O"></div>
        <div id="mmOut"></div>
        <p class="small">Usa las masas atómicas redondeadas del curso (H = 1, C = 12, O = 16, Cl = 35,5…). Para hidratos usá · o * (CuSO4*5H2O).</p>
      </div>
      <div class="panel">
        <h2>🔄 Conversor</h2>
        <p class="small">Escribí un valor en cualquier casilla y se calculan las demás para la sustancia de la izquierda.</p>
        <div class="field"><label>Masa (g)</label><input class="inp" data-c="g" inputmode="decimal" maxlength="40"></div>
        <div class="field"><label>Moles (mol)</label><input class="inp" data-c="mol" inputmode="decimal" value="1" maxlength="40"></div>
        <div class="field"><label>Partículas (moléculas / unidades)</label><input class="inp" data-c="N" inputmode="decimal" maxlength="40"></div>
        <div class="field"><label>Átomos totales</label><input class="inp" data-c="at" inputmode="decimal" maxlength="40"></div>
        <div class="field"><label>Volumen si es gas en CNPT (L)</label><input class="inp" data-c="L" inputmode="decimal" maxlength="40"></div>
      </div></div>`;
    const inF = $('#mmF', box), out = $('#mmOut', box);
    let M = 0, atomos = 0, last = 'mol';
    const PAL = ['#7c3aed', '#ec4899', '#f59e0b', '#06b6d4', '#22c55e', '#ef4444', '#3b82f6'];
    function calc() {
      try {
        const v = window.Safe.validate('formula', inF.value);
        if (!v.ok) throw new Error(v.error);
        const f = v.value.replace(/[₀-₉]/g, d => '₀₁₂₃₄₅₆₇₈₉'.indexOf(d));
        const d = C.desglose(f);
        M = C.masaMolar(f); atomos = d.reduce((s, x) => s + x.n, 0);
        out.innerHTML = `<div class="center" style="margin:8px 0">${C.chem(f)}<div class="result-big">${n2(M)} g/mol</div></div>
          <div class="comp-bar">${d.map((x, k) => `<span style="flex:${x.pct};background:${PAL[k % PAL.length]}">${x.el} ${n2(x.pct)}%</span>`).join('')}</div>
          <div class="table-wrap"><table class="tbl"><tr><th>Elemento</th><th>Átomos</th><th>Masa atómica</th><th>Aporte</th><th>%</th></tr>
          ${d.map(x => `<tr><td><b>${x.el}</b> <span class="small">${x.nombre}</span></td><td>${x.n}</td><td>${n2(x.masa)}</td><td>${x.n} × ${n2(x.masa)} = ${n2(x.sub)}</td><td>${n2(x.pct)} %</td></tr>`).join('')}
          <tr class="final"><td>Total</td><td>${atomos}</td><td></td><td>${n2(M)} g/mol</td><td>100 %</td></tr></table></div>`;
        conv(last);
      } catch (e) { M = 0; out.innerHTML = `<div class="feedback bad">⚠️ ${C.esc(e.message)}</div>`; }
    }
    const inputs = $$('[data-c]', box);
    function conv(from) {
      if (!M) return;
      const src = inputs.find(i => i.dataset.c === from);
      const v = C.parseNum(src.value); if (isNaN(v)) return;
      const mol = { g: v / M, mol: v, N: v / C.NA, at: v / C.NA / atomos, L: v / 22.4 }[from];
      const vals = { g: mol * M, mol, N: mol * C.NA, at: mol * C.NA * atomos, L: mol * 22.4 };
      inputs.forEach(i => { if (i.dataset.c !== from) i.value = C.numES(vals[i.dataset.c], 4).replace(/<sup>(.*?)<\/sup>/, '^$1').replace(' × ', 'x'); });
    }
    inputs.forEach(i => i.addEventListener('input', () => { last = i.dataset.c; conv(last); }));
    inF.addEventListener('input', calc);
    calc();
  }

  /* ---------------- pH: repollo morado ---------------- */
  const SUSTANCIAS = [['Jugo gástrico', 1.5], ['Limón', 2], ['Vinagre', 3], ['Gaseosa cola', 2.8], ['Café', 5], ['Leche', 6.5], ['Agua pura', 7], ['Sangre', 7.4], ['Bicarbonato', 8.3], ['Jabón', 10], ['Leche de magnesia', 10.5], ['Amoníaco', 11], ['Lavandina', 12.5], ['Soda cáustica', 14]];
  function labPH(box) {
    box.innerHTML = `<div class="panel">
      <h2>🥬 El repollo morado como indicador</h2>
      <p class="small">La antocianina del repollo cambia de color según el pH. Mové el control o “echá” una sustancia al vaso.</p>
      <div class="beaker-wrap">
        <div class="beaker"><div class="liquid" id="liq">${Array.from({ length: 6 }, (_, k) => `<span class="bubble" style="left:${15 + k * 13}%;animation-delay:${k * .5}s"></span>`).join('')}</div></div>
        <div style="min-width:240px">
          <div class="small">pH</div><div class="ph-readout" id="phR">7</div><span class="ph-tag" id="phT">Neutro</span>
          <div style="margin-top:12px" id="phC"></div>
        </div>
      </div>
      <div style="margin:22px 0 6px"><input type="range" class="ph-range" id="phS" min="0" max="14" step="0.1" value="7"></div>
      <div class="eq-labels"><span>0 · muy ácido</span><span>7 · neutro</span><span>14 · muy básico</span></div>
      <div class="subst">${SUSTANCIAS.map(([n, p]) => `<button data-p="${p}">${n}</button>`).join('')}</div>
      <div id="phNear" class="small" style="margin-top:10px"></div>
    </div>
    <div class="panel"><h2>🧠 ¿Cómo se calcula?</h2>
      <div class="formula-box">pH = − log [H<sub>3</sub>O<sup>+</sup>] &nbsp;·&nbsp; [H<sub>3</sub>O<sup>+</sup>] · [OH<sup>−</sup>] = 10<sup>−14</sup></div>
      <p>Si el pH baja 1 unidad, la concentración de H₃O⁺ se multiplica por <b>10</b>. Por eso el limón (pH 2) es 100.000 veces más ácido que el agua pura (pH 7).</p></div>`;
    const s = $('#phS', box);
    function upd() {
      const p = +s.value;
      $('#liq', box).style.background = window.cabbageColor(p);
      $('#phR', box).textContent = p.toFixed(1).replace('.', ',');
      const [tag, col] = p < 3 ? ['Muy ácido', '#dc2626'] : p < 6.5 ? ['Ácido', '#e11d48'] : p <= 7.5 ? ['Neutro', '#7c3aed'] : p < 11 ? ['Básico', '#0891b2'] : ['Muy básico', '#ca8a04'];
      const t = $('#phT', box); t.textContent = tag; t.style.background = col;
      const exp = v => `10<sup>${(-v).toFixed(1).replace('.', ',').replace(',0', '')}</sup>`;
      $('#phC', box).innerHTML = `[H₃O⁺] = ${exp(p)} M<br>[OH⁻] = ${exp(14 - p)} M<br><b>Color del repollo:</b> ${p < 3 ? 'rojo' : p < 5 ? 'rosa / fucsia' : p < 7 ? 'violeta rojizo' : p < 8 ? 'violeta' : p < 10 ? 'azul' : p < 12 ? 'verde azulado' : p < 13 ? 'verde' : 'amarillo'}`;
      const cerca = SUSTANCIAS.filter(([, v]) => Math.abs(v - p) <= 1).map(x => x[0]);
      $('#phNear', box).innerHTML = cerca.length ? '🔎 Cerca de este pH: <b>' + cerca.join(', ') + '</b>' : '';
    }
    s.addEventListener('input', upd);
    $$('.subst button', box).forEach(b => b.addEventListener('click', () => {
      const target = +b.dataset.p, start = +s.value, t0 = performance.now();
      (function anim(t) { const k = Math.min(1, (t - t0) / 600); s.value = start + (target - start) * (1 - Math.pow(1 - k, 3)); upd(); if (k < 1) requestAnimationFrame(anim); })(t0);
    }));
    upd();
  }

  /* ---------------- Reactor: reactivo limitante ---------------- */
  const RX = [
    { r: [[2, 'H2'], [1, 'O2']], p: [[2, 'H2O']] },
    { r: [[1, 'N2'], [3, 'H2']], p: [[2, 'NH3']] },
    { r: [[2, 'NO'], [1, 'O2']], p: [[2, 'NO2']] },
    { r: [[1, 'CH4'], [2, 'O2']], p: [[1, 'CO2'], [2, 'H2O']] },
    { r: [[1, 'H2'], [1, 'Cl2']], p: [[2, 'HCl']] }
  ];
  function molHTML(f, cls) {
    const c = C.parseFormula(f); let atoms = '';
    Object.keys(c).forEach(el => { for (let i = 0; i < c[el]; i++) atoms += `<span class="atom" style="background:${C.COLORES[el] || '#c4b5fd'}" title="${el}"></span>`; });
    return `<span class="mol ${cls || ''}" title="${f}">${atoms}</span>`;
  }
  function labReactor(box) {
    box.innerHTML = `<div class="panel">
      <h2>🍞 Reactor: ¿quién se acaba primero?</h2>
      <p class="small">Elegí una reacción y cuántas moléculas de cada reactivo ponés. Las que quedan con borde punteado son el <b>reactivo en exceso</b>. ¡Es como el pan y la mermelada!</p>
      <div class="field"><label>Reacción</label><select class="inp" id="rxSel">${RX.map((x, k) => `<option value="${k}">${uni(window.GEN_DATA.eqTxt(x))}</option>`).join('')}</select></div>
      <div class="lab-grid" id="rxSliders"></div>
      <div class="reactor" style="margin-top:12px"><div class="side" id="rxA"></div><div class="mid">→</div><div class="side" id="rxB"></div></div>
      <div class="legend">${['H', 'O', 'N', 'C', 'Cl'].map(e => `<span><span class="atom" style="background:${C.COLORES[e]}"></span>${C.NOMBRES[e]}</span>`).join('')}</div>
      <div id="rxOut"></div></div>`;
    let rx, cnt;
    function setup() {
      rx = RX[+$('#rxSel', box).value];
      cnt = rx.r.map(([c], k) => c * (k === 0 ? 4 : 3));
      $('#rxSliders', box).innerHTML = rx.r.map(([c, f], k) => `<div class="field"><label>Moléculas de ${C.chem(f)}: <b id="rv${k}">${cnt[k]}</b> <span class="small">(de a ${c})</span></label><input type="range" min="0" max="${c * 8}" step="${c}" value="${cnt[k]}" data-k="${k}"></div>`).join('');
      $$('#rxSliders input', box).forEach(i => i.addEventListener('input', () => { cnt[+i.dataset.k] = +i.value; $('#rv' + i.dataset.k, box).textContent = i.value; draw(); }));
      draw();
    }
    function draw() {
      const ext = Math.min(...rx.r.map(([c], k) => Math.floor(cnt[k] / c)));
      const sobra = rx.r.map(([c], k) => cnt[k] - ext * c);
      const limK = rx.r.map(([c], k) => cnt[k] / c).indexOf(Math.min(...rx.r.map(([c], k) => cnt[k] / c)));
      const iguales = rx.r.every(([c], k) => cnt[k] / c === cnt[0] / rx.r[0][0]);
      $('#rxA', box).innerHTML = '<h4>Antes (reactivos)</h4>' + rx.r.map(([, f], k) => Array.from({ length: cnt[k] }, () => molHTML(f)).join('')).join('');
      $('#rxB', box).innerHTML = '<h4>Después</h4>' + rx.p.map(([c, f]) => Array.from({ length: ext * c }, () => molHTML(f)).join('')).join('') + rx.r.map(([, f], k) => Array.from({ length: sobra[k] }, () => molHTML(f, 'left')).join('')).join('');
      const fila = (lab, arrR, arrP, cls) => `<tr class="${cls || ''}"><td>${lab}</td>${arrR.map(x => `<td>${x}</td>`).join('')}${arrP.map(x => `<td>${x}</td>`).join('')}</tr>`;
      $('#rxOut', box).innerHTML = `<div class="table-wrap"><table class="tbl"><tr><th></th>${rx.r.concat(rx.p).map(([, f]) => `<th>${C.chem(f)}</th>`).join('')}</tr>
        ${fila('Inicio', cnt, rx.p.map(() => 0))}
        ${fila('Reaccionan / se forman', rx.r.map(([c]) => '−' + ext * c), rx.p.map(([c]) => '+' + ext * c))}
        ${fila('Final', sobra, rx.p.map(([c]) => ext * c), 'final')}</table></div>
        <div class="feedback ${iguales ? 'ok' : 'info'}"><div class="fb-t">${cnt.some(x => x === 0) ? '😶 Falta un reactivo: no hay reacción.' : iguales ? '🎯 ¡Proporción estequiométrica exacta! No sobra nada.' : `🔒 Reactivo limitante: ${C.chem(rx.r[limK][1])}`}</div>
        ${!iguales && !cnt.some(x => x === 0) ? `Se terminó el ${C.chem(rx.r[limK][1])} y la reacción se detuvo. Sobra ${rx.r.map(([, f], k) => sobra[k] ? `${sobra[k]} de ${C.chem(f)}` : '').filter(Boolean).join(' y ')} (reactivo en exceso).` : ''}
        <div class="small" style="margin-top:4px">Lo mismo vale en moles: cambiá “moléculas” por “moles” y los números no cambian.</div></div>`;
    }
    $('#rxSel', box).addEventListener('change', setup);
    setup();
  }

  /* ---------------- Tabla de masas ---------------- */
  function labTabla(box) {
    box.innerHTML = `<div class="panel"><h2>📋 Masas atómicas usadas en la app</h2>
      <p class="small">Valores redondeados como en el material del curso (g/mol). Si tu profe usa otros decimales, el resultado puede variar un poquito: la app acepta un margen de error del 2 %.</p>
      <div class="ptable">${Object.keys(C.MASAS).map(el => `<div class="pel"><b>${el}</b><span>${n2(C.MASAS[el])}</span><small>${C.NOMBRES[el]}</small></div>`).join('')}</div></div>
      <div class="panel"><h2>📌 Constantes</h2><div class="table-wrap"><table class="tbl">
      <tr><td>Número de Avogadro</td><td>N<sub>A</sub> = 6,02 × 10<sup>23</sup> partículas/mol</td></tr>
      <tr><td>Volumen molar (CNPT: 1 atm, 273 K)</td><td>22,4 L/mol</td></tr>
      <tr><td>Constante de los gases</td><td>R = 0,082 atm·L/(mol·K)</td></tr>
      <tr><td>Unidad de masa atómica</td><td>1 u = 1,66054 × 10<sup>-24</sup> g</td></tr>
      <tr><td>Producto iónico del agua</td><td>K<sub>w</sub> = 1 × 10<sup>-14</sup></td></tr></table></div></div>`;
  }

  window.Labs = { render };
})();
