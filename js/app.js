/* =========================================================
   app.js — motor del juego: estado, rutas, vistas, ejercicios
   ========================================================= */
(function () {
  'use strict';
  const C = window.Chem;
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const h = (tag, attrs, html) => { const e = document.createElement(tag); if (attrs) for (const k in attrs) { if (k === 'class') e.className = attrs[k]; else if (k === 'style') e.style.cssText = attrs[k]; else if (k.startsWith('on')) e.addEventListener(k.slice(2), attrs[k]); else e.setAttribute(k, attrs[k]); } if (html != null) e.innerHTML = html; return e; };
  const fmt = C.fmt;
  const fmtHtml = s => String(s).replace(/\{([^}]+)\}/g, (m, f) => C.chem(f));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  /* ======================= ESTADO ======================= */
  const KEY = 'quimica-quest-v1';
  const DEFAULT = { name: '', xp: 0, worlds: {}, badges: [], stats: { correct: 0, wrong: 0, balances: 0, streak: 0, streakMax: 0, bestChallenge: 0, practice: 0, flips: 0, labs: [] }, sound: true, theme: '' };
  let S;
  // El estado guardado se reconstruye y valida campo por campo (ver security.js)
  function load() {
    let raw = {};
    try { raw = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { raw = {}; }
    S = window.Safe.sanitizeState(raw, {
      worlds: window.MUNDOS,
      badges: BADGES.map(b => b.id),
      labs: ['balance', 'masa', 'ph', 'reactor', 'tabla']
    });
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* sin almacenamiento */ } }
  function W(id) { if (!S.worlds[id]) S.worlds[id] = { seen: [], ex: {} }; return S.worlds[id]; }

  /* ======================= NIVELES ======================= */
  const NIVELES = [
    [0, 'Aprendiz de laboratorio'], [80, 'Lava-tubos de ensayo'], [200, 'Ayudante de laboratorio'], [380, 'Experimentador/a'],
    [620, 'Balanceador/a experto/a'], [920, 'Estequiómetra'], [1300, 'Químico/a junior'], [1750, 'Alquimista'],
    [2300, 'Nicolas Flamel'], [3000, 'Leyenda de la Tabla Periódica']
  ];
  function nivel(xp) {
    let i = 0; while (i + 1 < NIVELES.length && xp >= NIVELES[i + 1][0]) i++;
    const base = NIVELES[i][0], next = NIVELES[i + 1] ? NIVELES[i + 1][0] : base + 1000;
    return { n: i + 1, nombre: NIVELES[i][1], pct: Math.min(100, (xp - base) / (next - base) * 100), falta: next - xp };
  }

  /* ======================= LOGROS ======================= */
  const BADGES = [
    { id: 'primer', i: '🧪', t: 'Primera reacción', d: 'Respondé bien tu primer ejercicio' },
    { id: 'racha5', i: '🔥', t: 'En llamas', d: 'Racha de 5 respuestas correctas al primer intento' },
    { id: 'racha10', i: '☄️', t: 'Imparable', d: 'Racha de 10 respuestas correctas seguidas' },
    { id: 'lector', i: '📚', t: 'Ratón de biblioteca', d: 'Leé todas las cards de un mundo' },
    { id: 'mundo', i: '🏁', t: 'Mundo completo', d: 'Terminá todos los ejercicios de un mundo' },
    { id: 'tres', i: '⭐', t: 'Tres estrellas', d: 'Conseguí 3 estrellas en un mundo' },
    { id: 'equilibrista', i: '⚖️', t: 'Equilibrista', d: 'Balanceá 10 ecuaciones' },
    { id: 'rayo', i: '⚡', t: 'Rayo', d: 'Hacé 8 o más puntos en el Desafío relámpago' },
    { id: 'curioso', i: '🔬', t: 'Científico/a curioso/a', d: 'Probá las 5 herramientas del laboratorio' },
    { id: 'memoria', i: '🐘', t: 'Memoria de elefante', d: 'Girá 25 fichas de repaso' },
    { id: 'practicante', i: '♾️', t: 'Practicante', d: 'Resolvé 20 ejercicios de práctica extra' },
    { id: 'alquimista', i: '🏆', t: 'Alquimista total', d: 'Completá los 10 mundos' }
  ];
  function award(id) {
    if (S.badges.includes(id)) return;
    S.badges.push(id); save();
    const b = BADGES.find(x => x.id === id);
    toast(`<span class="ti">${b.i}</span><div>¡Logro desbloqueado!<br><small>${b.t}</small></div>`, 'badge-t');
    sfx('badge');
  }
  load(); // después de BADGES: la sanitización necesita la lista de logros válidos

  /* ======================= XP / UI GLOBAL ======================= */
  function addXP(n, ev) {
    if (!n) return;
    const antes = nivel(S.xp).n;
    S.xp += n; save();
    if (ev) floatXP(n, ev);
    renderTop();
    const despues = nivel(S.xp);
    if (despues.n > antes) {
      setTimeout(() => { toast(`<span class="ti">🎉</span><div>¡Subiste al nivel ${despues.n}!<br><small>${despues.nombre}</small></div>`, 'xp'); confetti(); sfx('level'); }, 400);
    }
  }
  function floatXP(n, ev) {
    const r = ev && ev.getBoundingClientRect ? ev.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0 };
    const f = h('div', { class: 'xp-float', style: `left:${r.left + r.width / 2 - 20}px;top:${r.top - 10}px` }, '+' + n + ' XP');
    document.body.appendChild(f); setTimeout(() => f.remove(), 1200);
  }
  function toast(html, cls) {
    const t = h('div', { class: 'toast ' + (cls || '') }, html);
    $('#toasts').appendChild(t);
    setTimeout(() => { t.style.transition = 'opacity .4s'; t.style.opacity = 0; setTimeout(() => t.remove(), 400); }, 3200);
  }
  function renderTop() {
    const nv = nivel(S.xp);
    $('#lvl').innerHTML = `Nv ${nv.n}`;
    $('#lvl').title = nv.nombre;
    $('#xpnum').textContent = S.xp + ' XP';
    $('#xpbar').style.width = nv.pct + '%';
    $('#streak').innerHTML = '🔥 ' + S.stats.streak;
    $('#soundBtn').textContent = S.sound ? '🔊' : '🔇';
  }

  /* ======================= SONIDO ======================= */
  let actx;
  function sfx(tipo) {
    if (!S.sound) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const seq = { ok: [[660, 0], [880, .09]], bad: [[200, 0], [150, .12]], level: [[523, 0], [659, .1], [784, .2], [1046, .3]], badge: [[784, 0], [988, .08], [1318, .16]], click: [[440, 0]] }[tipo] || [];
      seq.forEach(([f, t]) => {
        const o = actx.createOscillator(), g = actx.createGain();
        o.type = tipo === 'bad' ? 'sawtooth' : 'triangle'; o.frequency.value = f;
        g.gain.setValueAtTime(.0001, actx.currentTime + t);
        g.gain.exponentialRampToValueAtTime(tipo === 'bad' ? .06 : .12, actx.currentTime + t + .02);
        g.gain.exponentialRampToValueAtTime(.0001, actx.currentTime + t + .18);
        o.connect(g); g.connect(actx.destination); o.start(actx.currentTime + t); o.stop(actx.currentTime + t + .2);
      });
    } catch (e) { /* sin audio */ }
  }

  /* ======================= CONFETI ======================= */
  function confetti() {
    const cv = $('#confetti'), ctx = cv.getContext('2d');
    cv.width = innerWidth; cv.height = innerHeight;
    const cols = ['#7c3aed', '#ec4899', '#f59e0b', '#06b6d4', '#22c55e', '#ef4444'];
    const ps = Array.from({ length: 160 }, () => ({ x: innerWidth / 2 + (Math.random() - .5) * 200, y: innerHeight / 3, vx: (Math.random() - .5) * 14, vy: -Math.random() * 14 - 4, r: Math.random() * 6 + 4, c: cols[Math.floor(Math.random() * cols.length)], a: Math.random() * 6, va: (Math.random() - .5) * .3 }));
    let t = 0;
    (function frame() {
      ctx.clearRect(0, 0, cv.width, cv.height);
      ps.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .35; p.vx *= .99; p.a += p.va; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); ctx.restore(); });
      if (++t < 150) requestAnimationFrame(frame); else ctx.clearRect(0, 0, cv.width, cv.height);
    })();
  }

  /* ======================= COLORES pH ======================= */
  const CABBAGE = ['#c81d3a', '#d7263d', '#e3305a', '#d6337f', '#b83699', '#9b3aa8', '#7e3bb0', '#6a3fb5', '#4b5bbd', '#2f7fc2', '#1d9aa8', '#1fa37a', '#3fae4a', '#9bbd2a', '#e2c21b'];
  window.cabbageColor = ph => CABBAGE[Math.max(0, Math.min(14, Math.round(ph)))];
  function paintCabbage(root) { $$('[data-ph]', root).forEach(el => { el.style.background = window.cabbageColor(+el.dataset.ph); }); }

  /* ======================= PROGRESO ======================= */
  function worldStats(m) {
    const w = W(m.id);
    const total = m.ejercicios.length;
    const vals = Object.values(w.ex);
    const done = vals.length;
    const score = vals.reduce((s, v) => s + (v === 'ok' ? 1 : v === 'ok2' ? .6 : 0), 0);
    const seen = w.seen.length;
    const pct = Math.round((seen / m.cards.length) * 30 + (done / total) * 70);
    const acc = total ? score / total : 0;
    const stars = done < total ? 0 : acc >= .85 ? 3 : acc >= .6 ? 2 : 1;
    return { total, done, seen, pct, stars, complete: done >= total };
  }
  const starsHtml = n => `<span class="stars">${'★'.repeat(n)}<span class="off">${'★'.repeat(3 - n)}</span></span>`;

  function checkWorldBadges() {
    let completos = 0;
    window.MUNDOS.forEach(m => {
      const st = worldStats(m);
      if (st.seen >= m.cards.length) award('lector');
      if (st.complete) { completos++; award('mundo'); }
      if (st.stars === 3) award('tres');
    });
    if (completos === window.MUNDOS.length) award('alquimista');
  }

  /* ======================= ROUTER ======================= */
  const app = () => $('#app');
  function go(hash) { location.hash = hash; }
  function route() {
    const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    stopChallengeTimer();
    if (!parts.length) return viewHome();
    if (parts[0] === 'mundo') return viewWorld(parts[1], parts[2] || 'teoria');
    if (parts[0] === 'lab') return viewLab(parts[1] || 'balance');
    if (parts[0] === 'desafio') return viewChallenge();
    if (parts[0] === 'fichas') return viewFlash();
    if (parts[0] === 'logros') return viewBadges();
    viewHome();
  }
  window.addEventListener('hashchange', route);

  /* ======================= HOME ======================= */
  function viewHome() {
    const nv = nivel(S.xp);
    const next = window.MUNDOS.find(m => !worldStats(m).complete) || window.MUNDOS[0];
    const v = h('div', { class: 'view' });
    v.innerHTML = `
      <section class="hero">
        <div class="hero-main">
          <div class="hero-bubbles">${Array.from({ length: 10 }, (_, i) => `<span style="left:${i * 10 + 3}%;width:${10 + (i * 7) % 26}px;height:${10 + (i * 7) % 26}px;animation-delay:${i * .8}s"></span>`).join('')}</div>
          <h1>¡Hola, <input class="name-input" id="nameInp" placeholder="tu nombre" value="${C.esc(S.name)}" maxlength="18">! 👋</h1>
          <p>Bienvenido/a a <b>Química Quest</b>: leé las cards, resolvé desafíos, ganá XP y convertite en Alquimista. Nivel actual: <b>${nv.nombre}</b>.</p>
          <div class="btn-row"><a class="btn" href="#/mundo/${next.id}">${S.xp ? '▶ Continuar' : '🚀 Empezar'}: ${next.icon} ${next.titulo}</a></div>
        </div>
        <div class="hero-side">
          <button class="mode-card" data-go="#/lab"><span class="em">🔬</span><b>Laboratorio</b><small>Balanceador, pH, reactor y calculadoras</small></button>
          <button class="mode-card" data-go="#/desafio"><span class="em">⚡</span><b>Desafío relámpago</b><small>Récord: ${S.stats.bestChallenge} pts</small></button>
          <button class="mode-card" data-go="#/fichas"><span class="em">🃏</span><b>Fichas de repaso</b><small>${window.FICHAS.length} conceptos clave</small></button>
          <button class="mode-card" data-go="#/logros"><span class="em">🏅</span><b>Logros</b><small>${S.badges.length} / ${BADGES.length} desbloqueados</small></button>
        </div>
      </section>
      <div class="section-title"><h2>🗺️ El mapa de mundos</h2><span class="small">Orden recomendado: del 1 al 10 · Unidad 2 (Reacciones) → Unidad 4 (Estequiometría)</span></div>
      <div class="worlds">${window.MUNDOS.map(m => {
        const st = worldStats(m);
        return `<button class="world-card" style="--wc:${m.color}" data-go="#/mundo/${m.id}">
          ${st.complete ? '<span class="badge-done">✅</span>' : ''}
          <div class="w-top"><div class="w-icon">${m.icon}</div><div><div class="w-num">Mundo ${m.num}</div><h3>${m.titulo}</h3></div></div>
          <p>${m.sub}</p>
          <div class="progress"><i style="width:${st.pct}%"></i></div>
          <div class="w-foot"><span>${st.seen}/${m.cards.length} cards · ${st.done}/${st.total} ejerc.</span>${starsHtml(st.stars)}</div>
        </button>`;
      }).join('')}</div>`;
    app().replaceChildren(v);
    $$('[data-go]', v).forEach(b => b.addEventListener('click', () => go(b.dataset.go)));
    const ni = $('#nameInp', v);
    ni.addEventListener('input', () => { S.name = window.Safe.cleanText(ni.value, window.Safe.LIMITS.name); save(); });
    ni.style.width = Math.max(8, (ni.value || ni.placeholder).length + 1) + 'ch';
    ni.addEventListener('input', () => { ni.style.width = Math.max(8, (ni.value || ni.placeholder).length + 1) + 'ch'; });
  }

  /* ======================= MUNDO ======================= */
  const worldIdx = {}; // card/ejercicio actual en memoria
  function viewWorld(id, tab) {
    const m = window.MUNDOS.find(x => x.id === id);
    if (!m) return viewHome();
    const st = worldStats(m);
    const v = h('div', { class: 'view', style: `--wc:${m.color}` });
    v.innerHTML = `
      <button class="back" data-go="#/">← Mapa</button>
      <div class="world-head" style="--wc:${m.color}">
        <div class="w-icon">${m.icon}</div>
        <div style="position:relative;z-index:1"><div class="src">Mundo ${m.num} · ${m.fuente}</div><h1>${m.titulo}</h1><p>${m.sub}</p></div>
      </div>
      <div class="tabs">
        <button class="tab ${tab === 'teoria' ? 'active' : ''}" data-go="#/mundo/${id}/teoria">📖 Teoría <span class="count">${st.seen}/${m.cards.length}</span></button>
        <button class="tab ${tab === 'ejercicios' ? 'active' : ''}" data-go="#/mundo/${id}/ejercicios">🎯 Ejercicios <span class="count">${st.done}/${st.total}</span></button>
        ${m.practica ? `<button class="tab ${tab === 'practica' ? 'active' : ''}" data-go="#/mundo/${id}/practica">♾️ Práctica extra</button>` : ''}
      </div>
      <div id="wbody"></div>`;
    app().replaceChildren(v);
    $$('[data-go]', v).forEach(b => b.addEventListener('click', () => go(b.dataset.go)));
    const body = $('#wbody', v);
    if (tab === 'ejercicios') renderExercises(m, body);
    else if (tab === 'practica' && m.practica) renderPractice(m, body);
    else renderCards(m, body);
  }

  /* ---------- Cards de teoría ---------- */
  function renderCards(m, body) {
    const key = m.id + ':card';
    let i = worldIdx[key] || 0;
    const w = W(m.id);
    function markSeen(idx, el) {
      if (!w.seen.includes(idx)) { w.seen.push(idx); save(); addXP(2, el); if (w.seen.length === m.cards.length) checkWorldBadges(); }
    }
    function draw(dir) {
      worldIdx[key] = i;
      const c = m.cards[i];
      body.innerHTML = '';
      const card = h('article', { class: 'tcard' + (dir < 0 ? ' out-left' : '') });
      let html = `<div class="tc-head"><div class="tc-icon">${c.icon || '📘'}</div><div><div class="tc-num">CARD ${i + 1} DE ${m.cards.length}</div><h2>${c.title}</h2></div></div>`;
      if (c.body) html += `<div class="body">${fmt(c.body)}</div>`;
      if (c.html) html += `<div class="table-wrap">${fmtHtml(c.html)}</div>`;
      if (c.list) html += `<ul class="list">${c.list.map(x => `<li>${fmt(x)}</li>`).join('')}</ul>`;
      if (c.example) html += `<div class="box example"><div class="box-t">🔎 ${fmt(c.example.title)}</div>${c.example.lines.map(l => `<div class="line">${fmt(l)}</div>`).join('')}</div>`;
      if (c.steps) html += `<div class="box steps"><div class="box-t">🪜 ${fmt(c.steps.title)}</div><ol class="step-list"></ol><button class="btn small" id="nextStep">Siguiente paso ▸</button></div>`;
      if (c.tip) html += `<div class="box tip"><div class="box-t">💡 Tené en cuenta</div>${fmt(c.tip)}</div>`;
      if (c.fact) html += `<div class="box fact"><div class="box-t">✨ ¿Sabías que…?</div>${fmt(c.fact)}</div>`;
      card.innerHTML = html;
      paintCabbage(card);
      if (c.steps) {
        let k = 0; const ol = $('.step-list', card), btn = $('#nextStep', card);
        btn.addEventListener('click', () => {
          ol.appendChild(h('li', null, fmt(c.steps.items[k++])));
          if (k >= c.steps.items.length) { btn.textContent = '✔ Listo'; btn.disabled = true; }
        });
      }
      const nav = h('div', { class: 'card-nav' });
      nav.innerHTML = `<button class="btn ghost" id="prevC" ${i === 0 ? 'disabled' : ''}>← Anterior</button>
        <div class="dots">${m.cards.map((_, k) => `<button class="${k === i ? 'cur' : ''} ${w.seen.includes(k) ? 'seen' : ''}" data-k="${k}" aria-label="Card ${k + 1}"></button>`).join('')}</div>
        ${i < m.cards.length - 1 ? '<button class="btn" id="nextC">Siguiente →</button>' : `<button class="btn ok" id="toEx">🎯 ¡A practicar!</button>`}`;
      const stage = h('div', { class: 'card-stage' });
      stage.append(card, nav);
      body.appendChild(stage);
      markSeen(i, card);
      $('#prevC', nav).addEventListener('click', () => { if (i > 0) { i--; draw(-1); } });
      const nx = $('#nextC', nav); if (nx) nx.addEventListener('click', () => { i++; draw(1); });
      const te = $('#toEx', nav); if (te) te.addEventListener('click', () => go(`#/mundo/${m.id}/ejercicios`));
      $$('.dots button', nav).forEach(b => b.addEventListener('click', () => { const k = +b.dataset.k; const d = k < i ? -1 : 1; i = k; draw(d); }));
      updateTabCounts(m);
    }
    draw(1);
    keyNav = e => {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === 'ArrowRight' && i < m.cards.length - 1) { i++; draw(1); }
      if (e.key === 'ArrowLeft' && i > 0) { i--; draw(-1); }
    };
  }
  let keyNav = null;
  document.addEventListener('keydown', e => { if (keyNav && location.hash.includes('/teoria') || (keyNav && /mundo\/[^/]+$/.test(location.hash))) keyNav(e); });

  function updateTabCounts(m) {
    const st = worldStats(m);
    const tabs = $$('.tab .count');
    if (tabs[0]) tabs[0].textContent = `${st.seen}/${m.cards.length}`;
    if (tabs[1]) tabs[1].textContent = `${st.done}/${st.total}`;
  }

  /* ---------- Ejercicios del mundo ---------- */
  function renderExercises(m, body) {
    const w = W(m.id);
    const key = m.id + ':ex';
    let i = worldIdx[key];
    if (i == null) { i = m.ejercicios.findIndex((_, k) => !w.ex[k]); if (i < 0) i = 0; }
    function draw() {
      worldIdx[key] = i;
      body.innerHTML = '';
      const prog = h('div', { class: 'ex-progress' });
      prog.innerHTML = m.ejercicios.map((_, k) => `<button class="${w.ex[k] || ''} ${k === i ? 'cur' : ''}" data-k="${k}">${k + 1}</button>`).join('');
      $$('button', prog).forEach(b => b.addEventListener('click', () => { i = +b.dataset.k; draw(); }));
      const holder = h('div');
      body.append(prog, holder);
      const ex = m.ejercicios[i];
      const yaHecho = w.ex[i];
      renderExercise(holder, ex, {
        num: i + 1, total: m.ejercicios.length, xpBase: xpFor(ex), yaHecho,
        onDone: (res, el) => {
          const prev = w.ex[i];
          if (!prev || rank(res) > rank(prev)) w.ex[i] = res;
          save();
          if (!prev) addXP(res === 'ok' ? xpFor(ex) : res === 'ok2' ? Math.ceil(xpFor(ex) / 2) : 0, el);
          $$('button', prog)[i].className = w.ex[i] + ' cur';
          updateTabCounts(m);
          checkWorldBadges();
        },
        onNext: () => {
          const pend = m.ejercicios.findIndex((_, k) => k > i && !w.ex[k]);
          const pend2 = m.ejercicios.findIndex((_, k) => !w.ex[k]);
          if (pend >= 0) { i = pend; draw(); }
          else if (pend2 >= 0) { i = pend2; draw(); }
          else showSummary();
        }
      });
    }
    function showSummary() {
      const st = worldStats(m);
      const vals = Object.values(w.ex);
      body.innerHTML = `<div class="summary">
        <div class="big-stars">${'★'.repeat(st.stars)}<span class="off">${'★'.repeat(3 - st.stars)}</span></div>
        <h2>¡Mundo ${m.num} completado! ${m.icon}</h2>
        <p>${st.stars === 3 ? '¡Impecable! Sos un/a crack de la química.' : st.stars === 2 ? '¡Muy bien! Repasá los que te costaron para llegar a 3 estrellas.' : 'Completaste el mundo. Volvé a leer las cards y reintentá los ejercicios en rojo.'}</p>
        <div class="stat-row">
          <div class="stat"><b>${vals.filter(v => v === 'ok').length}</b><small>al primer intento</small></div>
          <div class="stat"><b>${vals.filter(v => v === 'ok2').length}</b><small>con reintento</small></div>
          <div class="stat"><b>${vals.filter(v => v === 'fail').length}</b><small>vistos con solución</small></div>
        </div>
        <div class="btn-row" style="justify-content:center">
          <button class="btn ghost" id="redo">🔁 Repasar ejercicios</button>
          ${m.practica ? `<a class="btn warn" href="#/mundo/${m.id}/practica">♾️ Práctica extra</a>` : ''}
          ${(() => { const nx = window.MUNDOS[m.num]; return nx ? `<a class="btn" href="#/mundo/${nx.id}">Siguiente mundo: ${nx.icon} →</a>` : '<a class="btn" href="#/desafio">⚡ Desafío relámpago</a>'; })()}
        </div></div>`;
      confetti(); sfx('level');
      $('#redo', body).addEventListener('click', () => { i = 0; draw(); });
    }
    if (m.ejercicios.every((_, k) => w.ex[k]) && worldIdx[key] == null) { worldIdx[key] = 0; showSummary(); }
    else draw();
  }
  const rank = r => ({ fail: 0, ok2: 1, ok: 2 })[r] || 0;
  const xpFor = ex => ({ bal: 15, multi: 20, num: 15, formula: 15, match: 15 })[ex.t] || 10;

  /* ---------- Práctica infinita ---------- */
  function renderPractice(m, body) {
    let sesion = 0, aciertos = 0;
    function draw() {
      const gen = window.GEN[m.practica[Math.floor(Math.random() * m.practica.length)]];
      const ex = gen();
      body.innerHTML = `<p class="small">Ejercicios generados al azar: ¡nunca se terminan! Cada acierto suma 3 XP. Sesión: <b>${aciertos}/${sesion}</b></p>`;
      const holder = h('div'); body.appendChild(holder);
      renderExercise(holder, ex, {
        label: 'Práctica', xpBase: 3,
        onDone: (res, el) => {
          sesion++; if (res !== 'fail') { aciertos++; S.stats.practice++; addXP(3, el); if (S.stats.practice >= 20) award('practicante'); save(); }
          $('p.small b', body).textContent = `${aciertos}/${sesion}`;
        },
        onNext: draw, nextLabel: 'Otro ejercicio 🎲'
      });
    }
    draw();
  }

  /* ======================= MOTOR DE EJERCICIOS ======================= */
  const TIPO_LABEL = { mc: 'Opción múltiple', tf: 'Verdadero o falso', num: 'Cálculo', multi: 'Cálculo en partes', formula: 'Escribí la fórmula', bal: 'Balanceá la ecuación', match: 'Uní con flechas' };
  const SUBS = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
  const normF = s => String(s || '').replace(/[₀-₉]/g, d => SUBS[d]).replace(/\s+/g, '');

  function renderExercise(holder, ex, o) {
    o = o || {};
    const single = o.mode === 'single';
    let attempts = 0, finished = false, hintShown = false;
    const card = h('div', { class: 'ex-card' });
    const head = `<div class="ex-meta"><span class="ex-type">${o.label || TIPO_LABEL[ex.t]}${o.num ? ` · ${o.num}/${o.total}` : ''}</span><span class="ex-xp">${o.yaHecho ? (o.yaHecho === 'fail' ? '👀 visto' : '✅ resuelto') : o.xpBase ? '+' + o.xpBase + ' XP' : ''}</span></div>`;
    const q = ex.t === 'bal' ? 'Ajustá los coeficientes para que haya la misma cantidad de átomos de cada elemento a ambos lados.' : ex.q;
    card.innerHTML = head + `<div class="ex-q">${fmt(q)}</div><div class="ex-body"></div><div class="hint-slot"></div><div class="ex-actions"></div><div class="fb-slot"></div>`;
    holder.replaceChildren(card);
    const bodyEl = $('.ex-body', card), actions = $('.ex-actions', card), fbSlot = $('.fb-slot', card);
    let getAnswer, checkFn, revealFn, lockFn;

    /* ----- tipos ----- */
    if (ex.t === 'mc' || ex.t === 'tf') {
      const ops = ex.t === 'tf' ? ['✔ Verdadero', '✘ Falso'] : ex.op;
      const order = ex.t === 'tf' ? [0, 1] : (ex.noShuffle ? ops.map((_, k) => k) : shuffle(ops.map((_, k) => k)));
      const correct = ex.t === 'tf' ? (ex.a ? 0 : 1) : ex.a;
      bodyEl.innerHTML = `<div class="${ex.t === 'tf' ? 'tf-row' : 'options'}">${order.map((k, pos) => `<button class="opt" data-k="${k}">${ex.t === 'mc' ? `<span class="key">${'ABCDEF'[pos]}</span>` : ''}<span>${fmt(ops[k])}</span></button>`).join('')}</div>`;
      let sel = null;
      $$('.opt', bodyEl).forEach(b => b.addEventListener('click', () => {
        if (finished) return;
        $$('.opt', bodyEl).forEach(x => x.classList.remove('sel', 'wrong'));
        b.classList.add('sel'); sel = +b.dataset.k; sfx('click');
        check();
      }));
      getAnswer = () => sel;
      checkFn = () => sel === correct;
      revealFn = () => { $$('.opt', bodyEl).forEach(b => { if (+b.dataset.k === correct) b.classList.add('right'); }); };
      lockFn = ok => { $$('.opt', bodyEl).forEach(b => { b.disabled = true; if (+b.dataset.k === sel) b.classList.add(ok ? 'right' : 'wrong'); }); if (!ok) revealFn(); };
    }
    else if (ex.t === 'num' || ex.t === 'multi') {
      const fields = ex.t === 'num' ? [{ l: '', a: ex.a, tol: ex.tol, unit: ex.unit }] : ex.fields;
      bodyEl.innerHTML = ex.t === 'num'
        ? `<div class="num-row"><input class="inp" inputmode="decimal" placeholder="Tu respuesta" style="width:200px" autocomplete="off" maxlength="40"><span class="unit">${ex.unit || ''}</span></div><p class="small">Podés usar coma o punto. Notación científica: 6,02e23 o 6,02x10^23.</p>`
        : `<div class="multi-grid">${fields.map(f => `<label><span>${fmt(f.l)}</span><input class="inp" inputmode="decimal" autocomplete="off" maxlength="40"><span class="unit">${f.unit || ''}</span></label>`).join('')}</div><p class="small">Podés usar coma o punto. Notación científica: 6,02e23.</p>`;
      const inps = $$('input', bodyEl);
      inps.forEach((inp, k) => inp.addEventListener('keydown', e => { if (e.key === 'Enter') { if (k < inps.length - 1 && !inps[k + 1].value) inps[k + 1].focus(); else check(); } }));
      setTimeout(() => !o.noFocus && inps[0] && innerWidth > 700 && inps[0].focus(), 50);
      const okField = (f, txt) => { const v = C.parseNum(txt); if (isNaN(v)) return false; if (!f.tol) return Math.abs(v - f.a) < 1e-9 || (f.a !== 0 && Math.abs(v - f.a) / Math.abs(f.a) < 1e-6); return C.aproxIgual(v, f.a, f.tol); };
      getAnswer = () => inps.every(i => i.value.trim()) ? true : null;
      checkFn = () => { let all = true; inps.forEach((inp, k) => { const ok = okField(fields[k], inp.value); inp.classList.toggle('right', ok); inp.classList.toggle('wrong', !ok); if (!ok) all = false; }); return all; };
      revealFn = () => inps.forEach((inp, k) => { if (!inp.classList.contains('right')) { inp.value = C.numES(fields[k].a, 3).replace(/<sup>(.*?)<\/sup>/, '^$1').replace(' × ', 'x'); inp.classList.remove('wrong'); inp.classList.add('right'); } });
      lockFn = ok => { inps.forEach(i => i.disabled = true); if (!ok) revealFn(); };
    }
    else if (ex.t === 'formula') {
      bodyEl.innerHTML = `<div class="num-row"><input class="inp" placeholder="Ej: H2SO4" style="width:220px" autocomplete="off" spellcheck="false" maxlength="60"><span class="unit" id="prev"></span></div><p class="small">Escribí los subíndices como números normales: Fe2O3 · Ca(OH)2. Respetá mayúsculas y minúsculas.</p>`;
      const inp = $('input', bodyEl), prev = $('#prev', bodyEl);
      inp.addEventListener('input', () => { prev.innerHTML = inp.value ? '→ ' + C.chem(normF(inp.value)) : ''; });
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
      getAnswer = () => inp.value.trim() || null;
      checkFn = () => { const v = window.Safe.validate('formula', normF(inp.value)); const ok = v.ok && C.mismaComposicion(v.value, ex.a); inp.classList.toggle('right', ok); inp.classList.toggle('wrong', !ok); return ok; };
      revealFn = () => { inp.value = ex.a; prev.innerHTML = '→ ' + C.chem(ex.a); inp.classList.remove('wrong'); inp.classList.add('right'); };
      lockFn = ok => { inp.disabled = true; if (!ok) revealFn(); };
    }
    else if (ex.t === 'bal') {
      const sp = ex.r.concat(ex.p);
      const coefs = sp.map(() => 1);
      const nR = ex.r.length;
      const sol = C.resolverBalance(ex.r, ex.p);
      bodyEl.innerHTML = `<div class="bal-eq">${sp.map((f, k) => `${k === nR ? '<span class="bal-arrow">→</span>' : k > 0 ? '<span class="bal-op">+</span>' : ''}
        <div class="bal-sp"><div class="stepper"><button data-k="${k}" data-d="1" aria-label="más">+</button><button data-k="${k}" data-d="-1" aria-label="menos">−</button></div><span class="coef">1</span><span class="f">${C.chem(f)}</span></div>`).join('')}</div>
        <div class="atom-table"></div>${scaleSVG()}`;
      const upd = () => {
        $$('.coef', bodyEl).forEach((c, k) => c.textContent = coefs[k]);
        const r = C.revisarBalance(ex.r, ex.p, coefs.slice(0, nR), coefs.slice(nR));
        $('.atom-table', bodyEl).innerHTML = r.tabla.map(t => `<div class="atom-pill ${t.izq === t.der ? 'ok' : 'no'}"><span class="el" style="background:${C.COLORES[t.el] || '#e9d5ff'}">${t.el}</span>${t.izq} | ${t.der}</div>`).join('');
        const dl = r.tabla.reduce((s, t) => s + t.izq, 0), dr = r.tabla.reduce((s, t) => s + t.der, 0);
        const ang = Math.max(-14, Math.min(14, (dr - dl) * 2));
        $('.beam', bodyEl).style.transform = `rotate(${r.balanceada ? 0 : ang === 0 ? 4 : ang}deg)`;
        return r;
      };
      $$('.stepper button', bodyEl).forEach(b => b.addEventListener('click', () => {
        if (finished) return;
        const k = +b.dataset.k; coefs[k] = Math.max(1, Math.min(15, coefs[k] + +b.dataset.d)); sfx('click'); upd();
        fbSlot.innerHTML = '';
      }));
      upd();
      getAnswer = () => true;
      checkFn = () => {
        const r = upd();
        if (r.balanceada && !r.simplificada) return 'simp:' + r.divisor;
        return r.balanceada;
      };
      revealFn = () => { if (sol) sol.forEach((c, k) => coefs[k] = c); upd(); };
      lockFn = ok => { $$('.stepper button', bodyEl).forEach(b => b.disabled = true); if (!ok) revealFn(); };
      ex._solTxt = sol ? sp.map((f, k) => (sol[k] > 1 ? sol[k] : '') + f).slice(0, nR).join(' + ') + ' -> ' + sp.map((f, k) => (sol[k] > 1 ? sol[k] : '') + f).slice(nR).join(' + ') : '';
    }
    else if (ex.t === 'match') {
      const left = ex.pairs.map((p, k) => ({ k, t: p[0] }));
      const right = shuffle(ex.pairs.map((p, k) => ({ k, t: p[1] })));
      const pairs = {}; // leftK -> rightK
      const PC = ['#7c3aed', '#ec4899', '#f59e0b', '#06b6d4', '#22c55e', '#ef4444', '#3b82f6'];
      bodyEl.innerHTML = `<p class="small">Tocá un elemento de la izquierda y después su pareja de la derecha.</p><div class="match"><div class="col L">${left.map(x => `<button class="mi" data-k="${x.k}">${fmt(x.t)}</button>`).join('')}</div><div class="col R">${right.map(x => `<button class="mi" data-k="${x.k}">${fmt(x.t)}</button>`).join('')}</div></div>`;
      let selL = null;
      const paint = () => {
        $$('.L .mi', bodyEl).forEach((b, idx) => { const k = +b.dataset.k; b.classList.remove('paired', 'wrong', 'right'); b.classList.toggle('sel', selL === k); if (pairs[k] != null) { b.classList.add('paired'); b.style.setProperty('--pc', PC[k % PC.length]); b.dataset.tag = idx + 1; } });
        $$('.R .mi', bodyEl).forEach(b => { const rk = +b.dataset.k; b.classList.remove('paired', 'wrong', 'right'); const lk = Object.keys(pairs).find(l => pairs[l] === rk); if (lk != null) { b.classList.add('paired'); b.style.setProperty('--pc', PC[lk % PC.length]); b.dataset.tag = left.findIndex(x => x.k === +lk) + 1; } });
      };
      $$('.L .mi', bodyEl).forEach(b => b.addEventListener('click', () => { if (finished) return; const k = +b.dataset.k; if (pairs[k] != null && selL !== k) { delete pairs[k]; } selL = selL === k ? null : k; sfx('click'); paint(); }));
      $$('.R .mi', bodyEl).forEach(b => b.addEventListener('click', () => {
        if (finished || selL == null) return; const rk = +b.dataset.k;
        Object.keys(pairs).forEach(l => { if (pairs[l] === rk) delete pairs[l]; });
        pairs[selL] = rk; selL = null; sfx('click'); paint();
      }));
      getAnswer = () => Object.keys(pairs).length === ex.pairs.length ? true : null;
      checkFn = () => {
        let all = true;
        $$('.L .mi', bodyEl).forEach(b => { const k = +b.dataset.k; const ok = pairs[k] === k; b.classList.add(ok ? 'right' : 'wrong'); if (!ok) all = false; });
        $$('.R .mi', bodyEl).forEach(b => { const rk = +b.dataset.k; const lk = Object.keys(pairs).find(l => pairs[l] === rk); b.classList.add(+lk === rk ? 'right' : 'wrong'); });
        if (!all) setTimeout(() => { if (!finished) { Object.keys(pairs).forEach(l => { if (pairs[l] !== +l) delete pairs[l]; }); paint(); } }, 900);
        return all;
      };
      revealFn = () => { ex.pairs.forEach((_, k) => pairs[k] = k); paint(); $$('.mi', bodyEl).forEach(b => b.classList.add('right')); };
      lockFn = ok => { if (!ok) revealFn(); };
    }

    /* ----- acciones ----- */
    const btnCheck = h('button', { class: 'btn' }, '✔ Comprobar');
    const btnHint = h('button', { class: 'btn ghost' }, '💡 Pista');
    const btnSol = h('button', { class: 'btn ghost' }, '👀 Ver solución');
    const btnNext = h('button', { class: 'btn ok hidden' }, o.nextLabel || 'Siguiente →');
    if (!(ex.t === 'mc' || ex.t === 'tf')) actions.append(btnCheck);
    if (!single && (ex.hint || ex.t === 'bal')) actions.append(btnHint);
    actions.append(h('span', { class: 'spacer' }));
    if (!single) actions.append(btnSol);
    actions.append(btnNext);
    btnCheck.addEventListener('click', check);
    btnHint.addEventListener('click', () => {
      if (hintShown) return; hintShown = true;
      const txt = ex.hint || 'Empezá por los elementos que aparecen en una sola sustancia de cada lado. Dejá el H y el O (y los elementos solos como O₂) para el final.';
      $('.hint-slot', card).appendChild(h('div', { class: 'hint-box' }, '💡 ' + fmt(txt)));
    });
    btnSol.addEventListener('click', () => { if (!finished) finish(false, true); });
    btnNext.addEventListener('click', () => o.onNext && o.onNext());

    function check() {
      if (finished) return;
      if (getAnswer() == null) { fbSlot.innerHTML = `<div class="feedback info"><div class="fb-t">Completá tu respuesta 🙂</div></div>`; return; }
      const r = checkFn();
      if (typeof r === 'string' && r.startsWith('simp:')) {
        fbSlot.innerHTML = `<div class="feedback info"><div class="fb-t">¡Casi! Está balanceada, pero…</div>Los coeficientes deben ser los enteros más chicos posibles. Dividí todos por ${r.split(':')[1]}.</div>`; return;
      }
      if (r) finish(true);
      else {
        attempts++; S.stats.wrong++; S.stats.streak = 0; save(); renderTop();
        sfx('bad');
        card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake');
        if (single) { finish(false); return; }
        fbSlot.innerHTML = `<div class="feedback bad"><div class="fb-t">${['¡Uy! No es correcto 🧐', 'Todavía no… ¡revisá! 🔍', 'Seguí intentando 💪'][Math.min(attempts - 1, 2)]}</div>${ex.hint && !hintShown ? 'Podés pedir una pista 💡 o ' : 'Podés '}volver a intentar o ver la solución.</div>`;
      }
    }

    function finish(ok, revealed) {
      finished = true;
      lockFn(ok);
      btnCheck.classList.add('hidden'); btnHint.classList.add('hidden'); btnSol.classList.add('hidden');
      btnNext.classList.remove('hidden');
      const res = ok ? (attempts === 0 ? 'ok' : 'ok2') : 'fail';
      if (ok) {
        S.stats.correct++; if (attempts === 0) { S.stats.streak++; S.stats.streakMax = Math.max(S.stats.streakMax, S.stats.streak); } save();
        if (ex.t === 'bal') { S.stats.balances++; if (S.stats.balances >= 10) award('equilibrista'); }
        award('primer'); if (S.stats.streak >= 5) award('racha5'); if (S.stats.streak >= 10) award('racha10');
        sfx('ok');
      } else if (revealed) { S.stats.streak = 0; save(); }
      renderTop();
      const titulo = ok ? ['¡Correcto! 🎉', '¡Excelente! ⚗️', '¡Bien ahí! 🔥', '¡Perfecto! ✨', '¡Genial! 🧠'][Math.floor(Math.random() * 5)] : revealed ? 'Esta es la solución 👇' : 'Respuesta incorrecta';
      let html = `<div class="fb-t">${titulo}</div>`;
      if (!ok || ex.t === 'bal') html += `<div><b>Respuesta:</b> ${answerText(ex)}</div>`;
      if (ex.exp) html += `<div style="margin-top:6px">${fmt(ex.exp)}</div>`;
      if (ex.steps) html += `<ol class="step-list" style="--wc:var(--accent)">${ex.steps.map(s => `<li>${fmt(s)}</li>`).join('')}</ol>`;
      fbSlot.innerHTML = `<div class="feedback ${ok ? 'ok' : revealed ? 'info' : 'bad'}">${html}</div>`;
      if (o.onDone) o.onDone(res, btnNext);
      if (innerWidth < 700) fbSlot.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    return { check };
  }

  function answerText(ex) {
    switch (ex.t) {
      case 'mc': return fmt(ex.op[ex.a]);
      case 'tf': return ex.a ? 'Verdadero' : 'Falso';
      case 'num': return C.numES(ex.a, 2) + ' ' + (ex.unit || '');
      case 'multi': return ex.fields.map(f => `${fmt(f.l)}: <b>${C.numES(f.a, 3)} ${f.unit || ''}</b>`).join(' · ');
      case 'formula': return C.chem(ex.a);
      case 'bal': return ex._solTxt ? C.chem(ex._solTxt) : '';
      case 'match': return ex.pairs.map(p => `${fmt(p[0])} → ${fmt(p[1])}`).join(' · ');
    }
    return '';
  }

  function scaleSVG() {
    return `<svg class="scale-svg" viewBox="0 0 260 120" aria-hidden="true">
      <rect x="122" y="40" width="16" height="70" rx="4" fill="#94a3b8"/><rect x="90" y="106" width="80" height="10" rx="5" fill="#64748b"/>
      <g class="beam"><rect x="20" y="36" width="220" height="8" rx="4" fill="#475569"/>
        <line x1="40" y1="44" x2="25" y2="80" stroke="#94a3b8" stroke-width="2"/><line x1="40" y1="44" x2="55" y2="80" stroke="#94a3b8" stroke-width="2"/>
        <line x1="220" y1="44" x2="205" y2="80" stroke="#94a3b8" stroke-width="2"/><line x1="220" y1="44" x2="235" y2="80" stroke="#94a3b8" stroke-width="2"/>
        <path d="M15 80 h50 a25 10 0 0 1 -50 0z" fill="#60a5fa"/><path d="M195 80 h50 a25 10 0 0 1 -50 0z" fill="#f472b6"/>
        <text x="40" y="104" text-anchor="middle" font-size="11" fill="currentColor" font-weight="700">Reactivos</text><text x="220" y="104" text-anchor="middle" font-size="11" fill="currentColor" font-weight="700">Productos</text></g>
      <circle cx="130" cy="40" r="7" fill="#f59e0b"/></svg>`;
  }

  /* ======================= DESAFÍO RELÁMPAGO ======================= */
  let chalTimer = null;
  function stopChallengeTimer() { if (chalTimer) { clearInterval(chalTimer); chalTimer = null; } }
  function poolDesafio() {
    const pool = [];
    window.MUNDOS.forEach(m => m.ejercicios.forEach(ex => { if (['mc', 'tf', 'num', 'formula', 'bal'].includes(ex.t)) pool.push(Object.assign({ _m: m }, ex)); }));
    return pool;
  }
  function viewChallenge() {
    const v = h('div', { class: 'view' });
    v.innerHTML = `<button class="back" data-go="#/">← Mapa</button>
      <div class="panel center" id="chalIntro">
        <div style="font-size:3.5rem">⚡</div><h1>Desafío relámpago</h1>
        <p>Preguntas al azar de <b>todos los mundos</b>. Tenés <b>3 vidas ❤️</b> y <b>45 segundos</b> por pregunta. Un solo intento: ¡pensá bien!<br>Cada acierto suma 1 punto y 5 XP. Récord actual: <b>${S.stats.bestChallenge}</b></p>
        <button class="btn warn" id="startChal">¡Empezar! 🚀</button></div>
      <div id="chalGame"></div>`;
    app().replaceChildren(v);
    $('[data-go]', v).addEventListener('click', () => go('#/'));
    $('#startChal', v).addEventListener('click', () => { $('#chalIntro', v).classList.add('hidden'); startChallenge($('#chalGame', v)); });
  }
  function startChallenge(box) {
    let vidas = 3, pts = 0, n = 0;
    const genExtra = ['masaMolar', 'gramosAMoles', 'tipoGen', 'phGen', 'oxGen', 'molesAVolumen', 'composicionGen'];
    const pool = shuffle(poolDesafio());
    function next() {
      stopChallengeTimer();
      if (vidas <= 0) return end();
      n++;
      const ex = (Math.random() < .35) ? window.GEN[genExtra[Math.floor(Math.random() * genExtra.length)]]() : pool[(n - 1) % pool.length];
      box.innerHTML = `<div class="chal-top"><div class="lives">${[0, 1, 2].map(k => `<span class="${k >= vidas ? 'lost' : ''}">❤️</span>`).join('')}</div><div class="chip">Pregunta ${n}</div><div class="chip level">⚡ ${pts} pts</div></div><div class="timer"><i style="width:100%"></i></div><div id="chalEx"></div>`;
      let t = 45; const bar = $('.timer i', box);
      const api = renderExercise($('#chalEx', box), ex, {
        mode: 'single', label: ex._m ? `${ex._m.icon} ${ex._m.titulo}` : '🎲 Generado', noFocus: false,
        onDone: (res, el) => {
          stopChallengeTimer();
          if (res === 'ok') { pts++; addXP(5, el); } else { vidas--; }
          $('.chip.level', box).innerHTML = `⚡ ${pts} pts`;
          $$('.lives span', box).forEach((s, k) => s.classList.toggle('lost', k >= vidas));
        },
        onNext: next, nextLabel: vidas > 0 ? 'Siguiente ⚡' : 'Ver resultado'
      });
      chalTimer = setInterval(() => {
        t--; bar.style.width = (t / 45 * 100) + '%';
        if (t <= 0) {
          stopChallengeTimer();
          vidas--; S.stats.streak = 0; save(); renderTop(); sfx('bad');
          $$('.lives span', box).forEach((s, k) => s.classList.toggle('lost', k >= vidas));
          const ex2 = $('#chalEx', box);
          $$('button, input', ex2).forEach(b => b.disabled = true);
          const nb = h('button', { class: 'btn ok' }, vidas > 0 ? 'Siguiente ⚡' : 'Ver resultado');
          nb.addEventListener('click', next);
          $('.fb-slot', ex2).innerHTML = `<div class="feedback bad"><div class="fb-t">⏰ ¡Se acabó el tiempo!</div><b>Respuesta:</b> ${answerText(ex)}</div>`;
          $('.ex-actions', ex2).replaceChildren(nb);
        }
      }, 1000);
      void api;
    }
    function end() {
      const record = pts > S.stats.bestChallenge;
      if (record) S.stats.bestChallenge = pts;
      save();
      if (pts >= 8) award('rayo');
      box.innerHTML = `<div class="summary"><div style="font-size:3.5rem">${pts >= 8 ? '🏆' : pts >= 4 ? '🥈' : '💥'}</div><h2>${pts} punto${pts === 1 ? '' : 's'}</h2>
        <p>${record ? '🎉 ¡Nuevo récord personal!' : `Tu récord es ${S.stats.bestChallenge} puntos.`}</p>
        <div class="btn-row" style="justify-content:center"><button class="btn warn" id="again">🔁 Jugar otra vez</button><a class="btn ghost" href="#/">Volver al mapa</a></div></div>`;
      if (record || pts >= 5) confetti();
      $('#again', box).addEventListener('click', () => startChallenge(box));
    }
    next();
  }

  /* ======================= FICHAS ======================= */
  function viewFlash() {
    let order = shuffle(window.FICHAS.map((_, k) => k)), i = 0;
    const v = h('div', { class: 'view' });
    v.innerHTML = `<button class="back" data-go="#/">← Mapa</button>
      <div class="section-title"><h2>🃏 Fichas de repaso</h2><span class="small">Tocá la ficha para darla vuelta · ← → para navegar</span></div>
      <div class="flash-wrap"><div class="flash" id="flash"><div class="face front"></div><div class="face back"></div></div></div>
      <div class="card-nav" style="max-width:560px;margin:18px auto 0"><button class="btn ghost" id="fp">←</button><span class="chip" id="fc"></span><button class="btn" id="fn">→</button></div>
      <p class="center"><button class="btn ghost small" id="fs">🔀 Mezclar</button></p>`;
    app().replaceChildren(v);
    $('[data-go]', v).addEventListener('click', () => go('#/'));
    const fl = $('#flash', v);
    function draw() {
      fl.classList.remove('flip');
      const [t, d] = window.FICHAS[order[i]];
      setTimeout(() => {
        $('.front', fl).innerHTML = `${C.esc(t)}<small>tocá para ver la definición</small>`;
        $('.back', fl).innerHTML = `<div>${C.esc(d)}</div><small>${C.esc(t)}</small>`;
      }, fl.classList.contains('flip') ? 250 : 0);
      $('#fc', v).textContent = `${i + 1} / ${order.length}`;
    }
    fl.addEventListener('click', () => { fl.classList.toggle('flip'); if (fl.classList.contains('flip')) { S.stats.flips++; save(); if (S.stats.flips >= 25) award('memoria'); } });
    $('#fp', v).addEventListener('click', () => { i = (i - 1 + order.length) % order.length; draw(); });
    $('#fn', v).addEventListener('click', () => { i = (i + 1) % order.length; draw(); });
    $('#fs', v).addEventListener('click', () => { order = shuffle(order); i = 0; draw(); });
    keyNav = null;
    flashKeys = e => { if (!location.hash.includes('fichas')) return; if (e.key === 'ArrowRight') $('#fn', v).click(); if (e.key === 'ArrowLeft') $('#fp', v).click(); if (e.key === ' ') { e.preventDefault(); fl.click(); } };
    draw();
  }
  let flashKeys = null;
  document.addEventListener('keydown', e => flashKeys && flashKeys(e));

  /* ======================= LOGROS ======================= */
  function viewBadges() {
    const st = S.stats;
    const v = h('div', { class: 'view' });
    v.innerHTML = `<button class="back" data-go="#/">← Mapa</button>
      <div class="section-title"><h2>🏅 Logros y estadísticas</h2></div>
      <div class="stat-row" style="justify-content:flex-start">
        <div class="stat"><b>${S.xp}</b><small>XP total</small></div>
        <div class="stat"><b>${st.correct}</b><small>respuestas correctas</small></div>
        <div class="stat"><b>${st.streakMax}</b><small>mejor racha</small></div>
        <div class="stat"><b>${st.balances}</b><small>ecuaciones balanceadas</small></div>
        <div class="stat"><b>${st.bestChallenge}</b><small>récord desafío</small></div>
      </div>
      <div class="badges">${BADGES.map(b => `<div class="badge ${S.badges.includes(b.id) ? '' : 'locked'}"><span class="bi">${b.i}</span><div><b>${b.t}</b><small>${b.d}</small></div></div>`).join('')}</div>
      <div class="panel" style="margin-top:20px"><h2>Niveles</h2><div class="table-wrap"><table class="tbl">${NIVELES.map((n, k) => `<tr ${nivel(S.xp).n === k + 1 ? 'class="final"' : ''}><td>Nv ${k + 1}</td><td>${n[1]}</td><td>${n[0]} XP</td></tr>`).join('')}</table></div>
      <p class="small">¿Querés empezar de cero? <button class="btn ghost small" id="reset">Borrar progreso</button></p></div>`;
    app().replaceChildren(v);
    $('[data-go]', v).addEventListener('click', () => go('#/'));
    $('#reset', v).addEventListener('click', e => {
      const b = e.currentTarget;
      if (b.dataset.sure) { const keep = { sound: S.sound, theme: S.theme, name: S.name }; S = Object.assign(JSON.parse(JSON.stringify(DEFAULT)), keep); save(); renderTop(); go('#/'); }
      else { b.dataset.sure = '1'; b.textContent = '¿Seguro/a? Tocá de nuevo para confirmar'; b.classList.add('warn'); }
    });
  }

  /* ======================= LABORATORIO ======================= */
  function viewLab(tool) {
    const tools = [['balance', '⚖️ Balanceador'], ['masa', '🧮 Masa molar y conversor'], ['ph', '🥬 Repollo morado (pH)'], ['reactor', '🍞 Reactor: limitante'], ['tabla', '📋 Tabla de masas']];
    if (!tools.some(t => t[0] === tool)) tool = 'balance';
    if (!S.stats.labs.includes(tool)) { S.stats.labs.push(tool); save(); if (S.stats.labs.length >= 5) award('curioso'); }
    const v = h('div', { class: 'view' });
    v.innerHTML = `<button class="back" data-go="#/">← Mapa</button>
      <div class="section-title"><h2>🔬 Laboratorio</h2><span class="small">Herramientas para experimentar y comprobar tus cálculos</span></div>
      <div class="lab-tabs">${tools.map(t => `<button class="tab ${t[0] === tool ? 'active' : ''}" data-go="#/lab/${t[0]}">${t[1]}</button>`).join('')}</div>
      <div id="labBody"></div>`;
    app().replaceChildren(v);
    $$('[data-go]', v).forEach(b => b.addEventListener('click', () => go(b.dataset.go)));
    window.Labs.render($('#labBody', v), tool, { scaleSVG, sfx, confetti });
  }

  /* ======================= INIT ======================= */
  function applyTheme() { if (S.theme) document.documentElement.dataset.theme = S.theme; else delete document.documentElement.dataset.theme; }
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    renderTop();
    $('#soundBtn').addEventListener('click', () => { S.sound = !S.sound; save(); renderTop(); sfx('ok'); });
    $('#themeBtn').addEventListener('click', () => {
      const dark = S.theme ? S.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
      S.theme = dark ? 'light' : 'dark'; save(); applyTheme();
    });
    route();
  });

  window.QQ = { renderExercise, fmtHtml };
})();
