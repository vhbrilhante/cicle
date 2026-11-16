/* =========================================================
   Cicle · protótipo navegável
   Sem dependências: HTML, CSS e JS puros.
   ========================================================= */
'use strict';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fmt = (n, dec = 0) => Number(n).toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec });
const brl = (n) => 'R$ ' + fmt(Math.round(n));

/* ---------------------------------------------------------
   Dados de exemplo (números fictícios)
   --------------------------------------------------------- */
const RISK = {
  low: { t: 'Seguro', d: 'Pode pegar com a mão', ic: 'check-circle', c: 'var(--risk-low)' },
  mid: { t: 'Atenção', d: 'Pegue com cuidado', ic: 'warning', c: 'var(--risk-mid)' },
  high: { t: 'Perigo', d: 'Não toque', ic: 'warning-octagon', c: 'var(--risk-high)' }
};

const MATERIALS = [
  { id: 'pet', name: 'PET', ic: 'beer-bottle', risk: 'low' },
  { id: 'plastico', name: 'Plástico duro', ic: 'jar', risk: 'low' },
  { id: 'papel', name: 'Papel', ic: 'newspaper', risk: 'low' },
  { id: 'papelao', name: 'Papelão', ic: 'package', risk: 'low' },
  { id: 'vidro', name: 'Vidro', ic: 'wine', risk: 'mid', d: 'Vidro corta. Pegue com cuidado.' },
  { id: 'lata', name: 'Lata', ic: 'cylinder', risk: 'low' },
  { id: 'metal', name: 'Metal', ic: 'nut', risk: 'mid', d: 'Metal pode cortar. Use a luva.' },
  { id: 'rejeito', name: 'Rejeito', ic: 'trash', risk: 'low', d: 'Vai para o descarte.' },
  { id: 'nao-sei', name: 'Não sei', ic: 'question', risk: 'mid', unknown: true, d: 'A foto vai para o gestor.' }
];
const MAT = Object.fromEntries(MATERIALS.map(m => [m.id, m]));

const ITEMS = [
  { name: 'Garrafa PET', tag: 'PET', mat: 'pet', risk: 'low', conf: 96, ic: 'beer-bottle', color: '#BFDBFE', rot: -18 },
  { name: 'Caixa de papelão', tag: 'Papelão', mat: 'papelao', risk: 'low', conf: 93, ic: 'package', color: '#D6B98C', rot: 8 },
  { name: 'Seringa', tag: 'Seringa', mat: null, risk: 'high', conf: 91, ic: 'syringe', color: '#F4F4F5', rot: -30, danger: true },
  { name: 'Lata de alumínio', tag: 'Lata', mat: 'lata', risk: 'low', conf: 95, ic: 'cylinder', color: '#D4D4D8', rot: 14 },
  { name: 'Não reconheci', tag: 'Não sei', mat: null, risk: 'mid', conf: 41, ic: 'jar', color: '#A1A1AA', rot: 24, unknown: true },
  { name: 'Garrafa de vidro', tag: 'Vidro', mat: 'vidro', risk: 'mid', conf: 88, ic: 'wine', color: '#86EFAC', rot: -8 },
  { name: 'Jornal', tag: 'Papel', mat: 'papel', risk: 'low', conf: 90, ic: 'newspaper', color: '#E7E5E4', rot: 4 }
];

const DEFAULT_PREFS = { voice: false, sounds: true, contrast: false, largeText: false, leftHand: false, timer: 5, reduceMotion: false };
const PROFILES = [
  { id: '0417', name: 'Maria Souza', short: 'Maria S.', ini: 'MS', prefs: { ...DEFAULT_PREFS } },
  { id: '0522', name: 'João Pereira', short: 'João P.', ini: 'JP', prefs: { ...DEFAULT_PREFS, voice: true, contrast: true, largeText: true, timer: 8 } },
  { id: '0631', name: 'Ana Lima', short: 'Ana L.', ini: 'AL', prefs: { ...DEFAULT_PREFS, leftHand: true, timer: 12, reduceMotion: true } },
  { id: '0712', name: 'Carlos Mota', short: 'Carlos M.', ini: 'CM', prefs: { ...DEFAULT_PREFS } },
  { id: '0815', name: 'Rita Farias', short: 'Rita F.', ini: 'RF', prefs: { ...DEFAULT_PREFS, sounds: false } }
];

const STOCK = [
  { id: 'pet', n: 'PET cristal', kg: 1840, pr: 2.80, d: 6, bay: 92, act: 'sell', baia: 'Baia 3', hum: 97.2,
    offers: [['Reciclar Norte', 'Porto Velho · coleta grátis', 2.95], ['EcoPlast RO', 'Ji-Paraná · frete por sua conta', 2.85], ['Coop. Madeira Verde', 'Porto Velho · coleta grátis', 2.70]] },
  { id: 'papelao', n: 'Papelão', kg: 4200, pr: 0.70, d: -2, bay: 84, act: 'sell', baia: 'Baia 1', hum: 96.1,
    offers: [['Papel Norte', 'Porto Velho · coleta grátis', 0.74], ['Reciclar Norte', 'Porto Velho · coleta grátis', 0.71], ['Papel RO', 'Ariquemes · frete por sua conta', 0.68]] },
  { id: 'aluminio', n: 'Alumínio', kg: 620, pr: 7.50, d: 4, bay: 31, act: 'keep', baia: 'Baia 5', hum: 98.4,
    offers: [['Metais Madeira', 'Porto Velho · coleta grátis', 7.70], ['Reciclar Norte', 'Porto Velho · coleta grátis', 7.55], ['Alumax RO', 'Cacoal · frete por sua conta', 7.30]] },
  { id: 'plastico', n: 'Plástico duro', kg: 950, pr: 2.40, d: 1, bay: 48, act: 'keep', baia: 'Baia 4', hum: 95.8,
    offers: [['EcoPlast RO', 'Ji-Paraná · frete por sua conta', 2.50], ['Reciclar Norte', 'Porto Velho · coleta grátis', 2.42]] },
  { id: 'papel', n: 'Papel branco', kg: 1100, pr: 1.10, d: 0, bay: 55, act: 'keep', baia: 'Baia 2', hum: 96.9,
    offers: [['Papel Norte', 'Porto Velho · coleta grátis', 1.12], ['Papel RO', 'Ariquemes · frete por sua conta', 1.05]] },
  { id: 'metal', n: 'Metal', kg: 1500, pr: 0.90, d: -3, bay: 60, act: 'keep', baia: 'Baia 6', hum: 94.7,
    offers: [['Ferro Velho Central', 'Porto Velho · coleta grátis', 0.92], ['Metais Madeira', 'Porto Velho · coleta grátis', 0.88]] },
  { id: 'vidro', n: 'Vidro', kg: 5200, pr: 0.15, d: 0, bay: 96, act: 'none', baia: 'Baia 7', hum: 93.0, offers: [] }
];

const SECTIONS = [
  { id: 'entrar', code: 'T1', group: 't', device: 'tablet', title: 'Entrar com crachá',
    note: 'O tablet é do posto, não da pessoa. O crachá diz quem está triando e já traz o perfil de acessibilidade que o gestor configurou para ela.',
    tries: ['Toque no visor para ler o crachá da Maria, ou escolha outro crachá abaixo.', 'João entra com voz, letra maior e alto contraste. Ana entra com o painel à esquerda, 12 s e menos animação.', '"Estou sem crachá" abre o PIN.'] },
  { id: 'pin', code: 'T1b', group: 't', device: 'tablet', title: 'Entrar com PIN',
    note: 'Saída para quando o crachá não é lido. Teclado numérico grande, pontos em vez de números e erro com movimento e texto, não só cor.',
    tries: ['PINs de teste: 0417 (Maria), 0522 (João), 0631 (Ana).', 'Digite um PIN errado para ver o erro.', 'No computador, os números do teclado também funcionam.'] },
  { id: 'conferir', code: 'T2', group: 't', device: 'tablet', title: 'Conferir item',
    note: 'A câmera identifica e a pessoa confirma. SIM e NÃO têm 128 px, para usar de luva. O resíduo segue na esteira de qualquer jeito: a tela nunca segura a produção.',
    tries: ['Responda SIM para registrar. Espere o tempo acabar para ver "não conferido".', 'O 3º item é uma seringa: a tela de perigo abre sozinha.', 'Toque em "Ouvir" para a leitura em voz alta.', 'Ligue "Simular sem rede": os registros ficam guardados no tablet.'], keys: true },
  { id: 'corrigir', code: 'T3', group: 't', device: 'tablet', title: 'Corrigir',
    note: 'Corrigir leva três toques: NÃO, material certo, confirmar. A foto do item congela enquanto a esteira continua. Cada correção ensina a câmera.',
    tries: ['Escolha um material: o alerta de risco muda junto.', 'O botão de confirmar só acende depois da escolha e diz o material.', 'Teclas 1 a 9 escolhem o material.'] },
  { id: 'perigo', code: 'T4', group: 't', device: 'tablet', title: 'Perigo',
    note: 'O painel inteiro vira o alerta, com som e movimento. A instrução vem antes da pergunta: primeiro "Não toque", depois "É perigo mesmo?".',
    tries: ['Confirme com SIM e abra o painel do gestor: o alerta chega lá.', 'NÃO leva para a correção, caso a câmera tenha errado.'], keys: true },
  { id: 'nao-identificado', code: 'T5', group: 't', device: 'tablet', title: 'Não identificado',
    note: '"Não sei" é resposta válida. Ninguém precisa chutar: a foto vai para o gestor classificar depois e o dado continua honesto.',
    tries: ['"Eu sei" leva para escolher o material.', '"Não sei" envia a foto e passa para o próximo item.'] },
  { id: 'fim-turno', code: 'T6', group: 't', device: 'tablet', title: 'Fim de turno e BU',
    note: 'A incerteza do fim do dia termina num papel: o triador leva o boletim do que fez e o gestor recebe o mesmo número.',
    tries: ['Toque em "Imprimir BU" e veja o boletim sair.', 'Os números são os do seu teste até aqui.'] },
  { id: 'visao-geral', code: 'G1', group: 'g', device: 'desktop', title: 'Visão geral',
    note: 'O gestor vê o dia ao vivo nas três unidades. Cada número vem com a taxa de conferência humana ao lado, para saber o quanto confiar nele.',
    tries: ['Na primeira abertura, o skeleton mostra o formato antes dos dados.', 'Confirme um perigo no tablet e volte aqui: o alerta aparece no topo.', 'Candeias está sem rede: o gestor vê a hora do último dado.'] },
  { id: 'estoque', code: 'G2', group: 'g', device: 'desktop', title: 'Estoque e vendas',
    note: 'O dado vira valor: estoque calculado dos itens conferidos, baia quase cheia e a melhor oferta. O fardo leva a origem, que vale para o crédito de reciclagem.',
    tries: ['Filtre por "Vender agora" ou "Baia cheia".', 'Escolha uma linha e uma oferta, e venda.', 'Vidro mostra o estado vazio: sem comprador na região.'] },
  { id: 'equipe', code: 'G3', group: 'g', device: 'desktop', title: 'Equipe e acessibilidade',
    note: 'O tablet é compartilhado, então as preferências ficam no crachá. O gestor configura uma vez e o tablet se ajusta quando a pessoa entra.',
    tries: ['Mude o perfil da Maria (ex.: ler em voz alta), volte para T1 e leia o crachá dela.', 'As mudanças salvam sozinhas, com confirmação discreta.'] }
];
const SEC = Object.fromEntries(SECTIONS.map(s => [s.id, s]));
const WORK = new Set(['conferir', 'corrigir', 'perigo', 'nao-identificado']);

/* ---------------------------------------------------------
   Estado
   --------------------------------------------------------- */
const S = {
  screen: null,
  user: null,
  prefs: { ...DEFAULT_PREFS },
  online: true, queued: 0, syncing: false,
  c: { conf: 247, corr: 14, per: 1, nid: 2, sem: 3 },
  mat: { pet: 81, papelao: 62, papel: 32, vidro: 24, plastico: 19, lata: 17, metal: 8, rejeito: 4 },
  i: 0, itemNo: 248,
  hist: [],
  fix: { from: 'conferir', pick: null },
  dangerBy: 'camera',
  pin: '',
  printed: false,
  dlg: null,
  timers: [],
  g: {
    alerts: [
      { risk: 'high', t: 'Seringa confirmada', w: 'Central · Posto 2 · 13:31' },
      { risk: 'high', t: 'Bateria inchada', w: 'Candeias · Posto 1 · 11:20' },
      { risk: 'mid', t: 'Vidro quebrado', w: 'Zona Leste · Posto 1 · 12:58' }
    ],
    unread: 0, loaded: {}, filter: 'todos', sel: 'pet', offer: 0, sold: {}, person: '0417'
  }
};
const item = () => ITEMS[S.i];

/* Timers da tela atual (limpos ao trocar de tela) */
function later(fn, ms) { const id = setTimeout(fn, ms); S.timers.push(id); return id; }
function every(fn, ms) { const id = setInterval(fn, ms); S.timers.push(id); return id; }
function clearTimers() { S.timers.forEach(id => { clearTimeout(id); clearInterval(id); }); S.timers = []; }
const motionReduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches || (isTablet() && S.prefs.reduceMotion);
const isTablet = () => SEC[S.screen]?.device !== 'desktop';

/* ---------------------------------------------------------
   Som e voz
   --------------------------------------------------------- */
let AC = null;
function tone(seq) {
  if (!S.prefs.sounds) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const t0 = AC.currentTime;
    seq.forEach(([f, d, start, type = 'sine', vol = 0.16]) => {
      const o = AC.createOscillator(), g = AC.createGain();
      o.type = type; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t0 + start);
      g.gain.exponentialRampToValueAtTime(vol, t0 + start + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + start + d);
      o.connect(g).connect(AC.destination);
      o.start(t0 + start); o.stop(t0 + start + d + 0.05);
    });
  } catch (e) { /* som indisponível */ }
}
const SND = {
  ok: () => tone([[660, 0.12, 0], [880, 0.2, 0.09]]),
  fix: () => tone([[523, 0.12, 0], [698, 0.2, 0.09]]),
  warn: () => tone([[440, 0.22, 0, 'triangle']]),
  danger: () => tone([[880, 0.2, 0, 'square', 0.09], [660, 0.2, 0.25, 'square', 0.09], [880, 0.2, 0.5, 'square', 0.09], [660, 0.2, 0.75, 'square', 0.09]])
};
function say(text, force) {
  if (!(S.prefs.voice || force) || !('speechSynthesis' in window)) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'pt-BR'; u.rate = 0.95;
    const v = speechSynthesis.getVoices().find(v => v.lang && v.lang.toLowerCase().startsWith('pt'));
    if (v) u.voice = v;
    speechSynthesis.speak(u);
  } catch (e) { /* voz indisponível */ }
}
function announce(text, urgent) {
  const el = urgent ? $('#live-alert') : $('#live');
  el.textContent = '';
  setTimeout(() => { el.textContent = text; }, 30);
}

/* ---------------------------------------------------------
   Microinterações utilitárias
   --------------------------------------------------------- */
function toast(text, kind = 'ok', ic = 'check-circle', ms = 2200) {
  const host = $('#toasts');
  while (host.children.length > 1) host.firstChild.remove();
  const t = document.createElement('div');
  t.className = `toast ${kind}`;
  t.innerHTML = `${icon(ic)}<span>${text}</span>`;
  host.appendChild(t);
  announce(text, kind === 'danger');
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 260); }, ms);
}

function countUp(el, to, { dur = 900, dec = 0, prefix = '', suffix = '' } = {}) {
  if (!el) return;
  if (motionReduced()) { el.textContent = prefix + fmt(to, dec) + suffix; return; }
  const t0 = performance.now();
  const step = (t) => {
    const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + fmt(to * e, dec) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function bump(el) { if (!el) return; el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }

let SCALE = 1;
function ripple(e) {
  const b = e.target.closest('.btn-xl, .btn-lg, .btn-md, .btn-sm, .mat, .key');
  if (!b || !$('#device').contains(b) || motionReduced()) return;
  const r = b.getBoundingClientRect();
  const x = (e.clientX - r.left) / SCALE, y = (e.clientY - r.top) / SCALE;
  const size = Math.max(r.width, r.height) / SCALE * 2.2;
  const s = document.createElement('span');
  s.className = 'ripple';
  s.style.cssText = `width:${size}px;height:${size}px;left:${x - size / 2}px;top:${y - size / 2}px`;
  b.appendChild(s);
  setTimeout(() => s.remove(), 600);
}

const okMark = () => `<span class="okmark"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="56"/><path d="M36 62 l16 16 l32 -34"/></svg></span>`;

/* ---------------------------------------------------------
   Componentes de tela (tablet)
   --------------------------------------------------------- */
function tBar({ user = true, end = false } = {}) {
  return `<header class="t-bar">
    <div class="left"><div class="t-logo">${LOGO}<b>cicle</b></div><div class="vr"></div><span class="posto">Posto 2 · Esteira A</span></div>
    <div class="right">
      <span id="netwrap" style="display:contents"></span>
      ${user && S.user ? `<div class="who"><span class="avatar">${S.user.ini}</span>${S.user.short}</div>` : ''}
      <button class="btn btn-outline btn-sm a11y-btn" data-act="a11y" aria-label="Acessibilidade" title="Acessibilidade">${icon('person-arms-spread')}</button>
      ${end ? `<button class="btn btn-outline btn-sm ic-l" data-act="end">${icon('sign-out')}Encerrar turno</button>` : ''}
    </div>
  </header>`;
}

function updateNet() {
  const w = $('#netwrap');
  if (w) {
    let html = '';
    if (!S.online) html = `<div class="net offline">${icon('cloud-slash')}<span>Sem rede · <b class="num">${S.queued}</b> guardados no tablet</span></div><div class="vr"></div>`;
    else if (S.syncing === 'up') html = `<div class="net sync">${icon('circle-notch', 'spin')}<span>Enviando ${S.queued}</span><span class="bar"><i id="syncbar"></i></span></div><div class="vr"></div>`;
    else if (S.syncing === 'done') html = `<div class="net">${icon('cloud-check')}<span>Tudo enviado</span></div><div class="vr"></div>`;
    w.innerHTML = html;
    const bar = $('#syncbar');
    if (bar) requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.width = '100%'; }));
  }
  const nt = $('#net-toggle');
  nt.innerHTML = `${icon(S.online ? 'cloud-check' : 'cloud-slash')}${S.online ? 'Simular sem rede' : 'Voltar a rede'}`;
  nt.classList.toggle('on', !S.online);
  nt.setAttribute('aria-pressed', String(!S.online));
}

function setNet(online) {
  S.online = online;
  if (online && S.queued > 0) {
    S.syncing = 'up'; updateNet();
    setTimeout(() => {
      S.syncing = 'done'; const n = S.queued; S.queued = 0; updateNet();
      if (isTablet()) toast(`${n} registros enviados ao servidor`, 'ok', 'cloud-check');
      setTimeout(() => { S.syncing = false; updateNet(); }, 1800);
    }, 1500);
  } else {
    S.syncing = false; updateNet();
    if (!online && isTablet()) toast('Sem rede: os registros ficam no tablet', 'warn', 'cloud-slash');
  }
}

function statsHTML() {
  return `<div class="stats">
    <div class="stat"><b class="num" id="st-conf">${fmt(S.c.conf)}</b>conferidos</div>
    <div class="stat"><b class="num" id="st-corr">${fmt(S.c.corr)}</b>corrigidos</div>
    <div class="stat"><b class="num" id="st-per">${fmt(S.c.per)}</b>${S.c.per === 1 ? 'perigo' : 'perigos'}</div>
  </div>`;
}
function refreshStats(which) {
  const map = { conf: '#st-conf', corr: '#st-corr', per: '#st-per' };
  Object.entries(map).forEach(([k, sel]) => { const el = $(sel); if (el) el.textContent = fmt(S.c[k]); });
  const pl = $('#st-per'); if (pl) pl.nextSibling.textContent = S.c.per === 1 ? 'perigo' : 'perigos';
  if (which) bump($(map[which]));
}

function riskAlert(risk, desc) {
  const r = RISK[risk];
  return `<div class="alert ${risk}" role="status">${icon(r.ic)}<div><b>${r.t}</b><span>${desc || r.d}</span></div></div>`;
}

function workShell(endBtn = true) {
  return `<div class="screen enter" id="work">${tBar({ end: endBtn })}
    <div class="split">
      <section class="cam-side" aria-label="Câmera da esteira">
        <div class="cam" id="cam">
          <div class="belt"></div>
          <div class="obj" id="obj"></div>
          <div class="det" id="det"><div class="box"></div><div class="tag" id="tag"></div></div>
          <div class="cam-chip l" id="chip-l"></div>
          <div class="cam-chip r" id="chip-r"></div>
          <div class="flash" id="flash"></div>
        </div>
        <div class="shift">${statsHTML()}<button class="btn btn-outline btn-sm ic-l" data-act="undo" id="undo-btn">${icon('arrow-u-up-left')}Desfazer último</button></div>
      </section>
      <aside class="panel" id="panel" aria-live="polite"></aside>
    </div>
  </div>`;
}

/* Câmera: item entra na esteira e a detecção "trava" nele */
function camSet(it, { animate = true, paused = false, danger = false, strike = false, mode } = {}) {
  const cam = $('#cam'); if (!cam) return;
  const obj = $('#obj'), det = $('#det'), tag = $('#tag');
  cam.classList.toggle('paused', paused);
  cam.classList.toggle('danger', danger);
  obj.innerHTML = `<span style="transform:rotate(${it.rot}deg);color:${it.color};display:block">${icon(it.ic)}</span>`;
  const color = strike ? '#FFFFFF' : RISK[it.risk].c;
  det.style.setProperty('--det', color);
  det.querySelector('.box').classList.toggle('dashed', strike || !!it.unknown);
  tag.innerHTML = strike ? `<s>${it.tag} ${it.conf}%</s>` : `${it.tag} ${it.conf}%`;
  tag.style.color = strike ? 'var(--ink)' : '#fff';
  obj.classList.remove('in', 'out'); det.classList.remove('on');
  void obj.offsetWidth;
  if (animate) { obj.classList.add('in'); det.classList.add('on'); }
  else { det.style.opacity = 1; det.classList.add('on'); det.style.animation = 'none'; }
  if (animate) det.style.animation = '';
  $('#chip-l').innerHTML = paused ? `${icon('pause')}Foto do item ${S.itemNo}` : `Item ${S.itemNo}`;
  const r = $('#chip-r');
  r.style.display = paused ? 'flex' : 'none';
  r.textContent = 'A esteira continua';
}

function startTimer(onEnd, text) {
  const bar = $('#tbar'); if (!bar) return;
  const d = S.prefs.timer;
  bar.style.transition = 'none'; bar.style.transform = 'scaleX(1)';
  void bar.offsetWidth;
  bar.style.setProperty('--td', d + 's');
  bar.style.transition = `transform ${d}s linear`; bar.style.transform = 'scaleX(0)';
  later(onEnd, d * 1000);
}

/* ---------------------------------------------------------
   Telas · triador
   --------------------------------------------------------- */
const SCREENS = {};

SCREENS.entrar = () => `<div class="screen enter">${tBar({ user: false })}
  <div class="split">
    <section class="login-left">
      <span class="label">Começar o turno</span>
      <h1>Mostre seu crachá</h1>
      <p>Segure o crachá na frente da câmera, com o quadrado preto virado para a tela.</p>
      <div class="badge-demo" aria-hidden="true"><div class="lines"><span class="avatar">${icon('user')}</span><i></i><i></i></div><div class="qr">${icon('qr-code')}</div></div>
      <div style="flex:1"></div>
      <button class="btn btn-outline btn-md ic-l" data-act="nopin">${icon('hand-waving')}Estou sem crachá</button>
      <span style="text-align:center;color:var(--ink-3);font-size:var(--t-body)">O gestor cria seu acesso em um minuto.</span>
    </section>
    <section class="viewfinder">
      <button class="vf" id="vf" data-act="scan" data-arg="0417" aria-label="Ler crachá (simulação: Maria)">
        <span class="corners">${icon('corners-out')}</span><span class="ghost">${icon('qr-code')}</span><span class="scanline"></span>${okMark()}
      </button>
      <div class="vf-status" id="vfs" role="status">${icon('circle-notch', 'spin')}Procurando crachá</div>
    </section>
  </div></div>`;

SCREENS.pin = () => `<div class="screen enter">${tBar({ user: false })}
  <div class="pin-wrap">
    <div class="pin-info">
      <span class="label">Entrar sem crachá</span>
      <h1>Digite seu PIN</h1>
      <p>São 4 números. O gestor passa o seu.</p>
      <div class="dots" id="dots" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      <div class="pin-msg" id="pinmsg" role="status"></div>
      <button class="btn btn-outline btn-md ic-l" data-act="back-badge" style="align-self:flex-start">${icon('arrow-left')}Voltar para o crachá</button>
    </div>
    <div class="keypad" role="group" aria-label="Teclado numérico">
      ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<button class="key" data-act="key" data-arg="${n}">${n}</button>`).join('')}
      <span class="key blank"></span>
      <button class="key" data-act="key" data-arg="0">0</button>
      <button class="key" data-act="key" data-arg="del" aria-label="Apagar">${icon('backspace')}</button>
    </div>
  </div></div>`;

SCREENS['fim-turno'] = () => {
  const total = S.c.conf + S.c.per + S.c.nid + S.c.sem;
  const rate = ((S.c.conf + S.c.per + S.c.nid) / total) * 100;
  const first = (S.user || PROFILES[0]).short.split(' ')[0];
  return `<div class="screen enter">${tBar({})}
  <div class="split">
    <section class="end-left">
      <div style="display:flex;flex-direction:column;gap:8px;padding-bottom:8px"><span class="label">Turno da manhã · 06:00 às 14:00</span><h1>Bom trabalho, ${first}</h1></div>
      <div class="kpis">
        <div class="card kpi"><div class="top"><span class="label">Conferidos</span><span style="color:var(--accent)">${icon('check-circle')}</span></div><span class="v num" data-count="${S.c.conf}">0</span><span class="d">de ${fmt(total)} que passaram</span></div>
        <div class="card kpi"><div class="top"><span class="label">Correções suas</span>${icon('pencil-simple')}</div><span class="v num" data-count="${S.c.corr}">0</span><span class="d">você ensinou a câmera</span></div>
        <div class="card kpi"><div class="top"><span class="label">Não identificados</span><span style="color:var(--risk-mid)">${icon('warning')}</span></div><span class="v num" data-count="${S.c.nid}">0</span><span class="d">o gestor vai ver as fotos</span></div>
        <div class="card kpi"><div class="top"><span class="label">Perigos avisados</span><span style="color:var(--risk-high)">${icon('warning-octagon')}</span></div><span class="v num" data-count="${S.c.per}">0</span><span class="d">ninguém se machucou</span></div>
      </div>
      <div class="card bonus">${icon('medal')}<div class="body"><div class="row"><b>${rate >= 97 ? 'Bônus do turno liberado' : 'Quase lá no bônus'}</b><span class="label" style="color:var(--accent-ink)">${fmt(rate, 1)}% de 97%</span></div><div class="progress"><i id="bonusbar" data-w="${Math.min(100, rate)}"></i></div><span style="color:var(--ink-3)">${rate >= 97 ? 'Você respondeu quase todos os itens.' : 'Responda mais itens para chegar à meta.'}</span></div></div>
    </section>
    <aside class="panel bu-panel">
      <span class="label">BU · boletim do turno</span>
      <div class="receipt-slot" id="rslot">
        <div class="printer-mouth"></div>
        <div class="receipt-hint" id="rhint"><div>${icon('printer')}<p style="margin:8px 0 0">O boletim sai aqui.</p></div></div>
      </div>
      <button class="btn btn-primary btn-lg ic-l" data-act="print" id="printbtn">
        <span class="btn-label-idle">${icon('printer')}Imprimir BU</span>
        <span class="btn-label-busy">${icon('circle-notch', 'spin')}Imprimindo…</span>
      </button>
      <button class="btn btn-ghost btn-sm ic-l" data-act="logout">${icon('sign-out')}Sair sem imprimir</button>
    </aside>
  </div></div>`;
};

function receiptHTML() {
  const m = S.mat;
  const row = (k, v) => `<div><span>${k}</span><span class="num">${fmt(v)}</span></div>`;
  return `<div class="receipt printing" id="receipt">
    <div class="head"><b>Cicle · Boletim do turno</b><span>Galpão Central · Posto 2</span><span>16/11/2026 · 06:00 às 14:00</span><span>${S.user ? 'Triador(a): ' + S.user.short + ' · #' + S.user.id : ''}</span></div>
    <hr>
    <div class="cols">${row('PET', m.pet)}${row('Lata', m.lata)}${row('Papelão', m.papelao)}${row('Metal', m.metal)}${row('Papel', m.papel)}${row('Rejeito', m.rejeito)}${row('Vidro', m.vidro)}${row('Não ident.', S.c.nid)}${row('Plástico duro', m.plastico)}${row('Perigo', S.c.per)}</div>
    <hr>
    <div class="tot"><div class="rows"><div><b>Conferidos</b><b class="num">${fmt(S.c.conf)}</b></div><div><span>Sem resposta</span><span class="num">${fmt(S.c.sem)}</span></div><div><span>Correções</span><span class="num">${fmt(S.c.corr)}</span></div></div>${icon('qr-code')}</div>
  </div>`;
}

/* Painéis das telas de trabalho */
function panelConferir(it) {
  return `<div class="swap-in pbody">
    <div class="panel-top"><span class="label">A câmera viu</span><button class="btn btn-ghost btn-sm ic-l" data-act="listen" style="--h:44px">${icon('speaker-high')}Ouvir</button></div>
    <div class="item-name">${it.name}</div>
    ${riskAlert(it.risk)}
    <div class="spacer"></div>
    <h2>Está certo?</h2>
    <div class="decision">
      <button class="btn btn-primary btn-xl" data-act="yes" aria-keyshortcuts="S">${icon('check')}SIM</button>
      <button class="btn btn-strong btn-xl" data-act="no" aria-keyshortcuts="N">${icon('x')}NÃO</button>
    </div>
    <div class="timer-row"><div class="timer"><i id="tbar"></i></div><span>Sem resposta em ${S.prefs.timer} s, fica como não conferido</span></div>
    <button class="btn btn-danger btn-md ic-l" data-act="flag" aria-keyshortcuts="P">${icon('warning-octagon')}Tem perigo aqui</button>
  </div>`;
}
function panelNaoId(it) {
  return `<div class="swap-in pbody">
    <div class="panel-top"><span class="label" style="color:var(--risk-mid-ink)">A câmera não sabe</span><button class="btn btn-ghost btn-sm ic-l" data-act="listen" style="--h:44px">${icon('speaker-high')}Ouvir</button></div>
    <div class="item-name">Não reconheci</div>
    ${riskAlert('mid')}
    <div class="spacer"></div>
    <h2>Você sabe o que é?</h2>
    <div class="decision">
      <button class="btn btn-primary btn-xl" data-act="know" style="font-size:calc(36px * var(--k))">${icon('hand-pointing')}EU SEI</button>
      <button class="btn btn-strong btn-xl" data-act="dontknow" style="font-size:calc(36px * var(--k))">${icon('question')}NÃO SEI</button>
    </div>
    <div class="timer-row"><div class="timer"><i id="tbar"></i></div><span>Sem resposta em ${S.prefs.timer} s, vai como "não sei"</span></div>
    <button class="btn btn-danger btn-md ic-l" data-act="flag">${icon('warning-octagon')}Tem perigo aqui</button>
  </div>`;
}
function panelPerigo(it) {
  const manual = S.dangerBy === 'manual';
  return `<div class="swap-in pbody">
    <span class="label">${manual ? 'Perigo · marcado por você' : 'Perigo · ' + it.tag.toLowerCase()}</span>
    <span class="big-ic">${icon('warning-octagon')}</span>
    <span class="headline">Não toque</span>
    <span class="sub">Deixe passar. O gestor já foi avisado.</span>
    <div class="spacer"></div>
    <h2>É perigo mesmo?</h2>
    <div class="decision">
      <button class="btn btn-on-red btn-xl" data-act="d-yes">${icon('check')}SIM</button>
      <button class="btn btn-on-red-outline btn-xl" data-act="d-no">${icon('x')}NÃO</button>
    </div>
    <div class="siren">${S.prefs.sounds ? icon('megaphone') + 'Aviso sonoro ligado no posto' : icon('speaker-slash') + 'Som desligado neste perfil'}</div>
  </div>`;
}
function panelCorrigir() {
  const pick = S.fix.pick ? MAT[S.fix.pick] : null;
  const step = pick ? 3 : 2;
  return `<div class="swap-in pbody">
    <div class="panel-top"><span class="label">Corrigir o item ${S.itemNo}</span><button class="btn btn-ghost btn-sm ic-l" data-act="fix-back" style="--h:44px">${icon('arrow-left')}Voltar</button></div>
    <div class="steps"><div class="bars"><i class="done"></i><i class="${pick ? 'done' : ''}"></i><i></i></div><span class="label">Passo ${step} de 3 · ${pick ? 'confirme' : 'escolha o material'}</span></div>
    <h2 style="padding-top:4px">O que é de verdade?</h2>
    <div class="mats" role="radiogroup" aria-label="Material">
      ${MATERIALS.map((m, i) => `<button class="mat ${m.unknown ? 'unknown' : ''}" role="radio" aria-checked="${S.fix.pick === m.id}" data-act="pick" data-arg="${m.id}" aria-keyshortcuts="${i + 1}">${icon(m.ic)}${m.name}</button>`).join('')}
    </div>
    <div class="alert-slot" id="aslot">${pick ? riskAlert(pick.risk, pick.d) : ''}</div>
    <div class="spacer"></div>
    <div class="foot-actions">
      <button class="btn btn-primary btn-lg ic-l grow" data-act="fix-ok" id="fixok" ${pick ? '' : 'disabled'}>${icon('check')}${pick ? (pick.unknown ? 'Enviar foto' : 'Confirmar ' + pick.name.toLowerCase()) : 'Confirmar'}</button>
    </div>
  </div>`;
}

const identifying = () => `<div class="identifying swap-in pbody">
  <span class="label">A câmera está olhando</span>
  <i class="sk" style="display:block;height:58px;width:78%"></i>
  <i class="sk" style="display:block;height:82px"></i>
  <span class="state">${icon('circle-notch', 'spin')}Identificando o item…</span>
</div>`;

const screenFor = (it) => it.danger ? 'perigo' : it.unknown ? 'nao-identificado' : 'conferir';

/* Monta a tela de trabalho. keepShell: mantém barra e câmera (sem piscar a tela).
   animateCam: o item entra na esteira e o painel espera a câmera "travar". */
function renderWork(id, { keepShell, animateCam }) {
  const it = item();
  if (!keepShell) $('#host').innerHTML = workShell();
  updateNet(); refreshStats();
  const panel = $('#panel');
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-label', 'Decisão');

  const fill = () => {
    panel.className = 'panel' + (id === 'perigo' ? ' danger' : '');
    if (id === 'perigo') panel.setAttribute('role', 'alert');
    if (id === 'conferir') panel.innerHTML = panelConferir(it);
    if (id === 'nao-identificado') panel.innerHTML = panelNaoId(it);
    if (id === 'perigo') panel.innerHTML = panelPerigo(it);
    if (id === 'corrigir') panel.innerHTML = panelCorrigir();
  };

  if (id === 'corrigir') camSet(it, { animate: false, paused: true, strike: true });
  else camSet(it, { animate: animateCam, danger: id === 'perigo' && !animateCam });

  const wait = animateCam && !motionReduced() ? 950 : 0;
  if (wait) { panel.className = 'panel'; panel.innerHTML = identifying(); later(fill, wait); }
  else fill();

  const after = wait + 120;
  if (id === 'conferir') later(() => { say(`${it.name}. ${RISK[it.risk].t}. Está certo?`); startTimer(onTimeout); }, after);
  if (id === 'nao-identificado') later(() => { say('Não reconheci este item. Você sabe o que é?'); startTimer(() => act.dontknow(true)); }, after);
  if (id === 'perigo') later(() => {
    $('#cam')?.classList.add('danger');
    SND.danger();
    announce('Perigo. Não toque. Deixe passar.', true);
    say('Perigo. Não toque. Deixe passar.');
  }, wait);
}

/* Avança para o próximo item da esteira */
function advance() {
  const obj = $('#obj');
  if (obj && !motionReduced()) { obj.classList.remove('in'); obj.classList.add('out'); }
  later(() => {
    S.i = (S.i + 1) % ITEMS.length;
    S.itemNo += 1;
    S.fix = { from: 'conferir', pick: null };
    S.dangerBy = 'camera';
    go(screenFor(item()), { nextItem: true });
  }, motionReduced() ? 0 : 380);
}

function register(kind, matId) {
  S.c[kind] += 1;
  if (matId && S.mat[matId] !== undefined) S.mat[matId] += 1;
  if (kind === 'corr') S.c.conf += 1;
  S.hist.push({ kind, matId });
  if (!S.online) { S.queued += 1; updateNet(); }
  refreshStats(kind === 'corr' ? 'corr' : kind);
  if (kind === 'corr') bump($('#st-conf'));
}

function onTimeout() {
  S.c.sem += 1; S.hist.push({ kind: 'sem' });
  SND.warn();
  toast('Sem resposta · ficou como não conferido', 'warn', 'timer');
  advance();
}

/* ---------------------------------------------------------
   Telas · gestor (desktop)
   --------------------------------------------------------- */
function gShell(active, inner) {
  const nav = (id, ic, label, extra = '') => `<button class="nav" data-act="${id ? 'g-nav' : 'soon'}" data-arg="${id || label}" ${active === id ? 'aria-current="page"' : ''}>${icon(ic)}${label}${extra}</button>`;
  const unread = S.g.unread ? `<span class="count">${S.g.unread}</span>` : '';
  return `<div class="screen enter"><div class="g-wrap">
    <nav class="g-menu" aria-label="Menu do gestor">
      <div class="t-logo">${LOGO}<b>cicle</b></div>
      <span class="grp">Operação</span>
      ${nav('visao-geral', 'squares-four', 'Visão geral', unread)}
      ${nav(null, 'video-camera', 'Triagem ao vivo')}
      ${nav(null, 'truck', 'Rotas')}
      <span class="grp">Valor</span>
      ${nav('estoque', 'package', 'Estoque e vendas')}
      ${nav(null, 'seal-check', 'Crédito de reciclagem')}
      <span class="grp">Gestão</span>
      ${nav('equipe', 'users-three', 'Equipe e acessibilidade')}
      ${nav(null, 'buildings', 'Unidades')}
      <div style="flex:1"></div>
      ${nav(null, 'gear', 'Ajustes')}
      <div class="g-user"><span class="avatar">RF</span><div><b>Raimundo F.</b><span>Gestor · 3 unidades</span></div></div>
    </nav>
    <main class="g-main" id="gmain">${inner}</main>
  </div></div>`;
}

function g1Skeleton() {
  const sk = (h, w = '100%') => `<i class="sk" style="display:block;height:${h}px;width:${w}"></i>`;
  return `<div class="g-head"><div><h1>Visão geral</h1><p>Carregando os dados das 3 unidades…</p></div></div>
  <div class="g-row">${[1, 2, 3, 4].map(() => `<div class="card g-card" style="flex:1;gap:10px">${sk(12, '50%')}${sk(34, '70%')}${sk(12, '60%')}</div>`).join('')}</div>
  <div class="g-row"><div class="card g-card" style="flex:1.5;height:330px;gap:12px">${sk(18, '40%')}${sk(12, '60%')}<div style="flex:1"></div>${sk(200)}</div><div class="card g-card" style="flex:1;height:330px;gap:14px">${sk(18, '50%')}${[1, 2, 3, 4, 5, 6, 7].map(() => sk(10)).join('')}</div></div>
  <div class="g-row" style="flex:1">${[1.45, 1, .9].map(f => `<div class="card g-card" style="flex:${f};gap:12px">${sk(18, '40%')}${sk(40)}${sk(40)}${sk(40)}</div>`).join('')}</div>`;
}

function g1Content() {
  const conf = 18420 + (S.c.conf - 247);
  const hours = [1.9, 2.4, 2.6, 2.5, 2.2, 2.3, 2.4, 2.1];
  const comp = [['Papelão', 2.3, 37], ['Vidro', 1.2, 19], ['PET', 1.1, 18], ['Papel', 0.6, 10], ['Plástico duro', 0.4, 6], ['Metal', 0.3, 5], ['Lata', 0.2, 3], ['Rejeito', 0.1, 2]];
  const alerts = S.g.alerts.slice(0, 3);
  return `<div class="g-head"><div><h1>Visão geral</h1><p>Segunda, 16 de novembro · dados até <span id="clock">13:42</span></p></div>
    <div class="tools">
      <button class="btn btn-outline btn-d ic-l" data-act="soon" data-arg="Filtro de unidades">${icon('buildings')}Todas as unidades${icon('caret-down')}</button>
      <button class="btn btn-outline btn-d ic-l" data-act="soon" data-arg="Filtro de período">${icon('calendar-blank')}Hoje${icon('caret-down')}</button>
      <button class="btn btn-ink btn-d ic-l" data-act="export" id="exportbtn"><span class="btn-label-idle">${icon('download-simple')}Exportar</span><span class="btn-label-busy">${icon('circle-notch', 'spin')}Gerando…</span></button>
    </div></div>
  <div class="g-row">
    <div class="card g-card kpi-d" style="flex:1"><span class="lab">Itens triados hoje</span><span class="val num" data-count="${conf}">0</span><span class="delta">${icon('arrow-up-right')}<b>12%</b> vs. segunda passada</span></div>
    <div class="card g-card kpi-d" style="flex:1"><span class="lab">Conferência humana</span><span class="val num" data-count="96.4" data-dec="1" data-suffix="%">0</span><span class="delta"><span class="mini-bar"><i data-w="96.4"></i></span>meta 95%</span></div>
    <div class="card g-card kpi-d" style="flex:1"><span class="lab">Peso estimado</span><span class="val num" data-count="6.2" data-dec="1" data-suffix=" t">0</span><span class="delta">calculado dos itens conferidos</span></div>
    <div class="card g-card kpi-d" style="flex:1"><span class="lab">Valor do dia em material</span><span class="val num" data-count="7980" data-prefix="R$ ">0</span><span class="delta">${icon('arrow-up-right')}<b>R$ 640</b> acima da média</span></div>
  </div>
  <div class="g-row">
    <div class="card g-card" style="flex:1.5;gap:14px">
      <div class="card-head"><div><h3>Triagem por hora</h3><span class="sub">Itens registrados nas 3 unidades, em milhares</span></div><div class="legend"><span><i></i>Hora fechada</span><span><i class="l"></i>Em andamento</span></div></div>
      <div class="chart" id="chart">${hours.map((h, i) => `<div class="col ${i === hours.length - 1 ? 'live' : ''}"><span>${fmt(h, 1)}</span><i data-h="${Math.round(h / 2.6 * 150)}"></i></div>`).join('')}</div>
      <div class="chart-x">${['6h', '7h', '8h', '9h', '10h', '11h', '12h', '13h'].map(h => `<span>${h}</span>`).join('')}</div>
    </div>
    <div class="card g-card" style="flex:1;gap:12px">
      <div><h3>O que passou na esteira</h3><span class="sub">Peso por material · 6,2 t no dia</span></div>
      ${comp.map(([n, w, p]) => `<div class="hbar"><span class="n">${n}</span><span class="t"><i data-w="${Math.round(w / 2.3 * 100)}"></i></span><span class="w">${fmt(w, 1)} t</span><span class="p">${p}%</span></div>`).join('')}
    </div>
  </div>
  <div class="g-row" style="flex:1;min-height:0">
    <div class="card g-card" style="flex:1.45">
      <div class="card-head"><h3>Unidades</h3><button class="link" data-act="soon" data-arg="Comparar unidades">Comparar</button></div>
      <table class="tbl"><thead><tr><th>Unidade</th><th class="r">Itens</th><th class="r">Conferência</th><th class="r">Alertas</th><th style="padding-left:16px">Último dado</th></tr></thead>
        <tbody>
          <tr><td><b>Galpão Central</b></td><td class="r num">${fmt(8940 + (S.c.conf - 247))}</td><td class="r">96,8%</td><td class="r neg">${S.g.alerts.filter(a => a.w.startsWith('Central')).length}</td><td style="padding-left:16px"><span class="dot pulse"></span>agora</td></tr>
          <tr><td><b>Zona Leste</b></td><td class="r num">6.130</td><td class="r">97,1%</td><td class="r" style="color:var(--risk-mid-ink);font-weight:700">1</td><td style="padding-left:16px"><span class="dot pulse"></span>agora</td></tr>
          <tr><td><b>Candeias</b></td><td class="r num" style="color:var(--ink-3)">3.350</td><td class="r" style="color:var(--ink-3)">93,9%</td><td class="r neg">1</td><td style="padding-left:16px;color:var(--risk-mid-ink)"><span style="display:inline-flex;align-items:center;gap:6px">${icon('cloud-slash')}há <span id="cand">4</span> min</span></td></tr>
        </tbody></table>
      <span class="sub" style="font-size:12px;display:flex;gap:6px;align-items:center;padding-top:8px">${icon('info')}Candeias espera o servidor. Os tablets guardam e enviam depois.</span>
    </div>
    <div class="card g-card" style="flex:1;gap:8px">
      <div class="card-head"><h3>Alertas de risco</h3><button class="link" data-act="soon" data-arg="Lista de alertas">Ver os ${S.g.alerts.length}</button></div>
      <div id="alerts" style="display:flex;flex-direction:column;gap:8px">${alerts.map(a => `<div class="g-alert ${a.risk} ${a.isNew ? 'new' : ''}">${icon(a.risk === 'high' ? 'warning-octagon' : 'warning')}<div><b>${a.t}</b><span>${a.w}</span></div></div>`).join('')}</div>
    </div>
    <div class="card g-card" style="flex:.9;gap:16px">
      <div class="card-head"><h3>Rotas ao vivo</h3><button class="link" data-act="soon" data-arg="Mapa de rotas">Mapa</button></div>
      ${[['Zona Sul', 'chega 14:20', 72], ['Centro', 'chega 15:05', 41], ['BR-364', 'saiu 13:30', 12]].map(([n, e, p], i) => `<div class="route"><div class="top"><b>${n}</b><span>${e}</span></div><div class="trk"><i id="rt${i}" style="width:${p}%"></i><span class="truck" id="rk${i}" style="left:${p}%">${icon('truck')}</span></div></div>`).join('')}
    </div>
  </div>`;
}

function g2Content() {
  const vis = (s) => S.g.filter === 'todos' || (S.g.filter === 'vender' && s.act === 'sell' && !S.g.sold[s.id]) || (S.g.filter === 'cheia' && s.bay >= 90 && !S.g.sold[s.id]);
  const parado = STOCK.reduce((a, s) => a + (S.g.sold[s.id] ? 0 : s.kg * s.pr), 0);
  const kgTotal = STOCK.reduce((a, s) => a + (S.g.sold[s.id] ? 0 : s.kg), 0);
  const cheias = STOCK.filter(s => s.bay >= 90 && !S.g.sold[s.id]).length;
  const rows = STOCK.map(s => {
    const sold = S.g.sold[s.id];
    const badge = sold ? `<span class="badge done">${icon('check')}Vendido</span>` : s.act === 'sell' ? '<span class="badge solid">Vender agora</span>' : s.act === 'keep' ? '<span class="badge line">Guardar</span>' : '<span class="badge warn">Sem comprador</span>';
    return `<tr class="click ${S.g.sel === s.id ? 'sel' : ''} ${vis(s) ? '' : 'hide'}" data-act="row" data-arg="${s.id}" tabindex="0">
      <td><b>${s.n}</b></td><td class="r num">${sold ? '0 kg' : fmt(s.kg) + ' kg'}</td><td class="r num">${fmt(s.pr, 2)}</td>
      <td class="r ${s.d > 0 ? 'pos' : s.d < 0 ? 'neg' : ''}" style="${s.d === 0 ? 'color:var(--ink-3)' : ''}">${s.d > 0 ? '+' : s.d < 0 ? '−' : ''}${Math.abs(s.d)}%</td>
      <td class="r num"><b>${sold ? 'R$ 0' : brl(s.kg * s.pr)}</b></td>
      <td style="width:150px;padding-left:20px"><div class="bay"><span class="t"><i class="${s.bay >= 90 && !sold ? 'hot' : ''}" style="width:${sold ? 0 : s.bay}%"></i></span><b>${sold ? 0 : s.bay}%</b></div></td>
      <td style="padding-left:12px">${badge}</td></tr>`;
  }).join('');
  return `<div class="g-head"><div><h1>Estoque e vendas</h1><p>Galpão Central · estoque calculado dos itens conferidos</p></div>
    <div class="tools"><button class="btn btn-outline btn-d ic-l" data-act="soon" data-arg="Filtro de unidade">${icon('buildings')}Galpão Central${icon('caret-down')}</button><button class="btn btn-ink btn-d ic-l" data-act="soon" data-arg="Registrar venda manual">${icon('plus')}Registrar venda</button></div></div>
  <div class="g-row">
    <div class="card g-card kpi-d" style="flex:1"><span class="lab">Valor parado no galpão</span><span class="val num" id="parado">${brl(parado)}</span><span class="delta">${fmt(kgTotal / 1000, 1)} t em ${STOCK.filter(s => !S.g.sold[s.id]).length} materiais</span></div>
    <div class="card g-card kpi-d" style="flex:1"><span class="lab">Crédito de reciclagem · novembro</span><span class="val num">R$ 3.834</span><span class="delta">42,6 t rastreadas · R$ 90 por tonelada</span></div>
    <div class="card g-card kpi-d" style="flex:1"><span class="lab">Baias quase cheias</span><span class="val num">${cheias} de 7</span><span class="delta" style="color:var(--risk-mid-ink)">${cheias ? icon('warning') + '<b style="color:var(--risk-mid-ink)">' + STOCK.filter(s => s.bay >= 90 && !S.g.sold[s.id]).map(s => s.n.split(' ')[0]).join(' e ') + ' passam de 90%</b>' : 'Nenhuma baia acima de 90%'}</span></div>
  </div>
  <div class="g-row" style="flex:1;min-height:0">
    <div class="card g-card" style="flex:1.7;gap:10px">
      <div class="card-head"><h3>Estoque por material</h3>
        <div class="seg" role="radiogroup" aria-label="Filtro">${[['todos', 'Todos'], ['vender', 'Vender agora'], ['cheia', 'Baia cheia']].map(([k, l]) => `<button role="radio" aria-checked="${S.g.filter === k}" data-act="filter" data-arg="${k}">${l}</button>`).join('')}</div></div>
      <table class="tbl"><thead><tr><th>Material</th><th class="r">Estoque</th><th class="r">R$/kg</th><th class="r">30 dias</th><th class="r">Valor</th><th style="padding-left:20px">Baia</th><th style="padding-left:12px">Ação</th></tr></thead>
      <tbody>${rows}</tbody>
      <tfoot><tr><td>Total</td><td class="r num">${fmt(kgTotal / 1000, 1)} t</td><td></td><td></td><td class="r num">${brl(parado)}</td><td></td><td></td></tr></tfoot></table>
    </div>
    <div class="card g-card" style="flex:1;gap:14px" id="detail">${detailHTML()}</div>
  </div>`;
}

function detailHTML() {
  const s = STOCK.find(x => x.id === S.g.sel);
  if (S.g.sold[s.id]) {
    const sale = S.g.sold[s.id];
    return `<div class="sold">${okMark()}<b>Venda registrada</b><span>${fmt(s.kg)} kg de ${s.n.toLowerCase()} para ${sale.to}</span><span class="num" style="font:700 28px/1 var(--f-display);color:var(--ink)">${brl(sale.total)}</span><span>Coleta agendada para amanhã, 8h. O crédito de reciclagem entra no fechamento do mês.</span></div>`;
  }
  const head = s.act === 'sell' ? 'Melhor venda agora' : s.act === 'keep' ? (s.d > 0 ? 'Pode esperar: o preço está subindo' : 'Pode guardar: a baia tem espaço') : 'Sem comprador na região';
  const sub = `${fmt(s.kg)} kg na ${s.baia.toLowerCase()} · preço ${s.d > 0 ? 'subiu ' + s.d + '%' : s.d < 0 ? 'caiu ' + Math.abs(s.d) + '%' : 'estável'} em 30 dias`;
  if (!s.offers.length) {
    return `<div><span class="label" style="color:var(--risk-mid-ink)">${head}</span><h3 style="font-size:24px">${s.n}</h3><span class="sub">${sub}</span></div>
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;text-align:center;border:1px dashed var(--line-strong);padding:24px;color:var(--ink-3)"><span style="font-size:40px">${icon('package')}</span><b style="color:var(--ink)">Nenhuma oferta para vidro nos últimos 30 dias</b><span>A baia passa de 90%. Avise a prefeitura ou combine frete com outra cidade.</span></div>
      <button class="btn btn-outline btn-d ic-l" data-act="soon" data-arg="Pedir oferta">${icon('megaphone')}Pedir oferta a compradores</button>`;
  }
  const o = s.offers;
  const pick = o[S.g.offer] || o[0];
  return `<div><span class="label" style="color:${s.act === 'sell' ? 'var(--accent-ink)' : 'var(--ink-3)'}">${head}</span><h3 style="font-size:24px">${s.n}</h3><span class="sub">${sub}</span></div>
    <div class="offers" role="radiogroup" aria-label="Ofertas">${o.map(([n, w, p], i) => `<button class="offer" role="radio" aria-checked="${i === S.g.offer}" data-act="offer" data-arg="${i}"><span class="radio"></span><span class="who2"><b>${n}</b><span>${w}</span></span><span class="pr num">R$ ${fmt(p, 2)}</span><span class="tt num">${brl(p * s.kg)}</span></button>`).join('')}</div>
    <div class="trace"><span class="label" style="font-size:12px">De onde veio · fardo #0142</span><div class="path">${icon('truck')}Rota Zona Sul<span class="ar">${icon('arrow-right')}</span>${icon('scan')}Posto 2<span class="ar">${icon('arrow-right')}</span>${icon('package')}${s.baia}</div><small>${fmt(s.hum, 1)}% dos itens deste fardo foram conferidos por uma pessoa. Vale para o crédito de reciclagem.</small></div>
    <div style="flex:1"></div>
    <button class="btn btn-primary btn-d" data-act="sell" style="height:40px;font-size:15px;gap:8px">Vender para ${pick[0]}${icon('arrow-right')}</button>`;
}

function profileTags(p) {
  const t = [];
  if (p.voice) t.push('Voz'); if (!p.sounds) t.push('Sem som'); if (p.contrast) t.push('Alto contraste');
  if (p.largeText) t.push('Letra maior'); if (p.leftHand) t.push('Mão esquerda'); if (p.timer !== 5) t.push(p.timer + ' s');
  if (p.reduceMotion) t.push('Menos animação');
  return t.length ? t.map(x => `<span class="badge line">${x}</span>`).join('') : '<span class="badge done">Padrão</span>';
}

function g3Content() {
  const tags = profileTags;
  const sel = PROFILES.find(p => p.id === S.g.person);
  const opt = (k, ic, title, desc) => `<div class="opt">${icon(ic)}<div class="txt"><b>${title}</b><span>${desc}</span></div><button class="switch sm" role="switch" aria-checked="${sel.prefs[k]}" aria-label="${title}" data-act="gpref" data-arg="${k}"></button></div>`;
  return `<div class="g-head"><div><h1>Equipe e acessibilidade</h1><p>Galpão Central · o perfil vai no crachá e vale em qualquer tablet</p></div>
    <div class="tools"><button class="btn btn-ink btn-d ic-l" data-act="soon" data-arg="Cadastrar triador">${icon('plus')}Cadastrar triador</button></div></div>
  <div class="g-row" style="flex:1;min-height:0">
    <div class="card g-card" style="flex:1.2;gap:8px">
      <div class="card-head"><div><h3>Triadores</h3><span class="sub">5 pessoas · 2 turnos</span></div></div>
      <div class="people" role="list">${PROFILES.map(p => `<button class="person" role="listitem" data-act="person" data-arg="${p.id}" aria-current="${p.id === S.g.person}"><span class="avatar">${p.ini}</span><span class="nm"><b>${p.name}</b><span>Crachá #${p.id} · Posto ${p.id === '0417' || p.id === '0522' ? 2 : 1}</span></span><span class="tags" id="tags-${p.id}">${tags(p.prefs)}</span></button>`).join('')}</div>
    </div>
    <div class="card g-card prefs-d" style="flex:1;gap:4px">
      <div class="card-head" style="padding-bottom:8px;border-bottom:1px solid var(--line)"><div style="display:flex;gap:12px;align-items:center"><span class="avatar" style="width:44px;height:44px">${sel.ini}</span><div><h3>${sel.name}</h3><span class="sub">Crachá #${sel.id} · PIN ${sel.id}</span></div></div>
        <button class="btn btn-outline btn-d ic-l" data-act="soon" data-arg="Imprimir crachá">${icon('qr-code')}Imprimir crachá</button></div>
      <div style="overflow-y:auto;flex:1">
        ${opt('voice', 'speaker-high', 'Ler em voz alta', 'O tablet fala o material e o risco de cada item.')}
        ${opt('sounds', 'megaphone', 'Sons de aviso', 'Som curto ao registrar, sirene em perigo.')}
        ${opt('contrast', 'circle-half', 'Alto contraste', 'Cores mais escuras para luz forte ou vista cansada.')}
        ${opt('largeText', 'arrows-left-right', 'Letra maior', 'Aumenta todo o texto do tablet em 15%.')}
        ${opt('leftHand', 'hand-pointing', 'Painel do lado esquerdo', 'Para quem trabalha com a mão esquerda.')}
        <div class="opt">${icon('timer')}<div class="txt"><b>Tempo para responder</b><span>Quem precisa de mais tempo não perde o bônus.</span></div><div class="seg" role="radiogroup" aria-label="Tempo">${[5, 8, 12].map(t => `<button role="radio" aria-checked="${sel.prefs.timer === t}" data-act="gtimer" data-arg="${t}">${t} s</button>`).join('')}</div></div>
        ${opt('reduceMotion', 'pause', 'Menos animação', 'Corta movimentos para quem sente tontura.')}
      </div>
      <div class="save-note" id="savenote">${icon('info')}As mudanças valem no próximo login do crachá.</div>
    </div>
  </div>`;
}

/* ---------------------------------------------------------
   Folha de acessibilidade (tablet) e diálogos
   --------------------------------------------------------- */
function openSheet() {
  const p = S.prefs;
  const opt = (k, ic, title, desc) => `<div class="opt">${icon(ic)}<div class="txt"><b>${title}</b><span>${desc}</span></div><button class="switch" role="switch" aria-checked="${p[k]}" aria-label="${title}" data-act="pref" data-arg="${k}"></button></div>`;
  $('#layer').innerHTML = `<div class="scrim" data-act="close-sheet"></div>
    <section class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-t">
      <div class="sheet-head"><div><span class="label">${S.user ? 'Perfil de ' + S.user.short : 'Antes de entrar'}</span><h2 id="sheet-t">Acessibilidade</h2></div>
        <button class="btn btn-outline btn-sm" data-act="close-sheet" aria-label="Fechar" style="width:52px;padding:0">${icon('x')}</button></div>
      <div class="sheet-body">
        ${opt('voice', 'speaker-high', 'Ler em voz alta', 'Fala o material e o risco de cada item.')}
        ${opt('sounds', 'megaphone', 'Sons de aviso', 'Som ao registrar e sirene em perigo.')}
        ${opt('contrast', 'circle-half', 'Alto contraste', 'Para luz forte ou vista cansada.')}
        ${opt('largeText', 'arrows-left-right', 'Letra maior', 'Todo o texto 15% maior.')}
        ${opt('leftHand', 'hand-pointing', 'Painel do lado esquerdo', 'Para quem usa a mão esquerda.')}
        <div class="opt col">${icon('timer')}<div class="txt"><b>Tempo para responder</b><span>Depois disso o item fica como não conferido.</span></div>
          <div class="seg" role="radiogroup" aria-label="Tempo para responder">${[5, 8, 12].map(t => `<button role="radio" aria-checked="${p.timer === t}" data-act="pref-timer" data-arg="${t}">${t} s</button>`).join('')}</div></div>
        ${opt('reduceMotion', 'pause', 'Menos animação', 'Corta movimentos da tela.')}
      </div>
      <div class="sheet-foot">${icon('check-circle')}${S.user ? 'Salvo no crachá de ' + S.user.short.split(' ')[0] + '. Vale em qualquer tablet.' : 'Vale até alguém entrar com o crachá.'}</div>
    </section>`;
  clearTimers();
  setTimeout(() => $('.sheet .switch')?.focus(), 50);
}
function closeLayer() {
  const had = !!$('#layer').innerHTML;
  $('#layer').innerHTML = ''; S.dlg = null;
  if (had && WORK.has(S.screen)) go(S.screen);   // retoma o item e o tempo
}

function openDialog({ title, body, actions }) {
  if (WORK.has(S.screen)) clearTimers();          // o tempo para enquanto o diálogo está aberto
  S.dlg = {};
  const btns = actions.map((a, i) => { S.dlg['dlg' + i] = a.fn; return `<button class="btn ${a.cls} ${isTablet() ? 'btn-md' : 'btn-d'} ${a.ic ? 'ic-l' : ''}" data-act="dlg${i}" id="dlg${i}">${a.html || ((a.ic ? icon(a.ic) : '') + a.label)}</button>`; }).join('');
  S.dlg['close'] = () => closeLayer();
  $('#layer').innerHTML = `<div class="scrim" data-act="close"></div><section class="dialog" role="dialog" aria-modal="true" aria-labelledby="dlg-t"><h2 id="dlg-t">${title}</h2><p>${body}</p><div class="actions">${btns}</div></section>`;
  setTimeout(() => $('#dlg' + (actions.length - 1))?.focus(), 50);
}

function applyPrefs() {
  const d = $('#device');
  const on = isTablet();
  d.dataset.contrast = on && S.prefs.contrast ? 'high' : '';
  d.dataset.text = on && S.prefs.largeText ? 'lg' : '';
  d.dataset.hand = on && S.prefs.leftHand ? 'left' : '';
  d.dataset.motion = on && S.prefs.reduceMotion ? 'reduce' : '';
}

/* ---------------------------------------------------------
   Login
   --------------------------------------------------------- */
function login(profile, via) {
  const first = profile.short.split(' ')[0];
  SND.ok();
  if (via === 'badge') {
    $('#vf')?.classList.add('ok');
    const st = $('#vfs');
    if (st) st.innerHTML = `<span class="hello">Olá, ${first}</span>`;
  }
  announce(`Olá, ${first}. Carregando seu perfil.`);
  later(() => {
    const st = $('#vfs') || $('#pinmsg');
    if (st) st.innerHTML = `<div style="display:flex;flex-direction:column;gap:12px;align-items:${via === 'badge' ? 'center' : 'flex-start'}"><span style="display:flex;gap:10px;align-items:center;font:500 var(--t-label)/1 var(--f-label)">${icon('circle-notch', 'spin')}Carregando seu perfil</span><div class="profile-load"><i class="sk"></i><i class="sk"></i><i class="sk"></i></div></div>`;
  }, 750);
  later(() => {
    S.user = profile;
    S.prefs = profile.prefs;       // mesmo objeto: mudar no tablet salva no crachá
    applyPrefs();
    const on = [];
    if (S.prefs.voice) on.push('voz'); if (S.prefs.contrast) on.push('alto contraste'); if (S.prefs.largeText) on.push('letra maior');
    if (S.prefs.leftHand) on.push('painel à esquerda'); if (S.prefs.timer !== 5) on.push(S.prefs.timer + ' s'); if (S.prefs.reduceMotion) on.push('menos animação');
    go(screenFor(item()));
    toast(on.length ? `Perfil aplicado: ${on.join(', ')}` : `Bom turno, ${first}`, 'ok', on.length ? 'person-arms-spread' : 'check-circle', 2600);
  }, 1700);
}

/* ---------------------------------------------------------
   Ações
   --------------------------------------------------------- */
const act = {
  scan: (id) => { if ($('#vf').classList.contains('ok')) return; login(PROFILES.find(p => p.id === id) || PROFILES[0], 'badge'); },
  nopin: () => go('pin'),
  'back-badge': () => go('entrar'),
  key: (k) => {
    if (S.pin.length >= 4 && k !== 'del') return;
    if (k === 'del') S.pin = S.pin.slice(0, -1); else S.pin += k;
    const dots = $$('#dots i');
    dots.forEach((d, i) => d.classList.toggle('on', i < S.pin.length));
    $('#pinmsg').className = 'pin-msg'; $('#pinmsg').textContent = '';
    if (S.pin.length === 4) {
      $('#pinmsg').innerHTML = `<span style="display:flex;gap:8px;align-items:center">${icon('circle-notch', 'spin')}Conferindo…</span>`;
      later(() => {
        const p = PROFILES.find(x => x.id === S.pin);
        if (p) { $('#dots').classList.add('ok'); S.pin = ''; login(p, 'pin'); }
        else {
          SND.warn();
          const el = $('#dots'); el.classList.remove('err'); void el.offsetWidth; el.classList.add('err');
          $('#pinmsg').className = 'pin-msg err'; $('#pinmsg').textContent = 'PIN não encontrado. Tente de novo.';
          announce('PIN não encontrado. Tente de novo.', true);
          later(() => { S.pin = ''; $$('#dots i').forEach(d => d.classList.remove('on')); el.classList.remove('err'); }, 600);
        }
      }, 650);
    }
  },
  a11y: () => openSheet(),
  'close-sheet': () => closeLayer(),
  pref: (k, b) => {
    S.prefs[k] = !S.prefs[k];
    b.setAttribute('aria-checked', S.prefs[k]);
    applyPrefs();
    if (k === 'voice' && S.prefs.voice) say('Leitura em voz alta ligada.');
    if (k === 'sounds' && S.prefs.sounds) SND.ok();
  },
  'pref-timer': (t, b) => { S.prefs.timer = +t; $$('[data-act="pref-timer"]').forEach(x => x.setAttribute('aria-checked', x === b)); },
  end: () => openDialog({
    title: 'Encerrar o turno?', body: `Você conferiu ${fmt(S.c.conf)} itens hoje. O tablet fecha o turno e imprime o seu boletim.`,
    actions: [{ label: 'Continuar triando', cls: 'btn-outline', fn: () => closeLayer() }, { label: 'Encerrar', cls: 'btn-primary', ic: 'sign-out', fn: () => { $('#layer').innerHTML = ''; S.dlg = null; go('fim-turno'); } }]
  }),
  yes: () => {
    const it = item(); clearTimers();
    register('conf', it.mat);
    SND.ok();
    const f = $('#flash'); f?.classList.remove('go'); void f?.offsetWidth; f?.classList.add('go');
    toast(`Registrado · ${it.tag}`, 'ok', 'check-circle', 1500);
    advance();
  },
  no: () => { clearTimers(); S.fix = { from: S.screen, pick: null }; go('corrigir'); },
  flag: () => { clearTimers(); S.dangerBy = 'manual'; go('perigo'); },
  listen: () => { const it = item(); say(it.unknown ? 'Não reconheci este item. Pegue com cuidado.' : `${it.name}. ${RISK[it.risk].t}. ${RISK[it.risk].d}.`, true); },
  undo: () => {
    const h = S.hist.pop();
    if (!h) { toast('Nada para desfazer', 'warn', 'info', 1500); return; }
    if (h.kind === 'sem') S.c.sem -= 1;
    else {
      S.c[h.kind] -= 1;
      if (h.kind === 'corr') S.c.conf -= 1;
      if (h.matId && S.mat[h.matId] !== undefined) S.mat[h.matId] -= 1;
      if (h.kind === 'per') { S.g.alerts.shift(); S.g.unread = Math.max(0, S.g.unread - 1); }
    }
    if (!S.online && S.queued > 0 && h.kind !== 'sem') { S.queued -= 1; updateNet(); }
    refreshStats();
    toast('Último registro desfeito', 'ok', 'arrow-u-up-left', 1500);
  },
  'd-yes': () => {
    clearTimers();
    const it = item();
    register('per', null);
    S.g.alerts.unshift({ risk: 'high', t: (S.dangerBy === 'manual' ? 'Perigo marcado' : it.name + ' confirmada'), w: 'Central · Posto 2 · agora', isNew: true });
    S.g.unread += 1;
    toast('Perigo registrado · gestor avisado', 'danger', 'megaphone', 2000);
    advance();
  },
  'd-no': () => { clearTimers(); S.fix = { from: 'perigo', pick: null }; go('corrigir'); },
  know: () => { clearTimers(); S.fix = { from: 'nao-identificado', pick: null }; go('corrigir'); },
  dontknow: (auto) => {
    clearTimers();
    register('nid', null);
    if (auto === true) { SND.warn(); toast('Sem resposta · foto enviada ao gestor', 'warn', 'timer'); }
    else { SND.ok(); toast('Foto enviada ao gestor', 'ok', 'arrow-up-right', 1600); }
    advance();
  },
  pick: (id) => {
    S.fix.pick = id;
    const m = MAT[id];
    $$('.mat').forEach(b => b.setAttribute('aria-checked', b.dataset.arg === id));
    $('#aslot').innerHTML = riskAlert(m.risk, m.d);
    const ok = $('#fixok');
    ok.disabled = false;
    ok.innerHTML = `${icon('check')}${m.unknown ? 'Enviar foto' : 'Confirmar ' + m.name.toLowerCase()}`;
    const bars = $$('.steps .bars i'); bars[1].classList.add('done');
    $('.steps .label').textContent = 'Passo 3 de 3 · confirme';
    say(m.name);
  },
  'fix-ok': () => {
    const m = MAT[S.fix.pick]; if (!m) return;
    if (m.unknown) { act.dontknow(); return; }
    register('corr', m.id);
    SND.fix();
    toast(`Corrigido para ${m.name.toLowerCase()}`, 'ok', 'pencil-simple', 1600);
    advance();
  },
  'fix-back': () => { const from = S.fix.from || 'conferir'; S.fix.pick = null; go(from === 'corrigir' ? 'conferir' : from); },
  print: (_, b) => {
    if (S.printed) { act.logout(); return; }
    b.classList.add('loading'); b.disabled = true;
    $('#rhint')?.remove();
    $('#rslot').insertAdjacentHTML('beforeend', receiptHTML());
    say('Imprimindo o boletim.');
    later(() => {
      S.printed = true;
      b.classList.remove('loading'); b.disabled = false;
      b.className = 'btn btn-outline btn-lg ic-l';
      b.innerHTML = `${icon('sign-out')}Sair do turno`;
      SND.ok();
      toast('BU impresso', 'ok', 'printer', 1800);
    }, motionReduced() ? 300 : 2700);
  },
  logout: () => {
    S.user = null; S.prefs = { ...DEFAULT_PREFS }; S.printed = false; S.hist = [];
    applyPrefs(); go('entrar');
  },
  /* gestor */
  'g-nav': (id) => go(id),
  soon: (what) => toast(`${what || 'Esta parte'} fica fora deste protótipo`, 'warn', 'info', 1800),
  export: (_, b) => { b.classList.add('loading'); b.disabled = true; setTimeout(() => { b.classList.remove('loading'); b.disabled = false; toast('Relatório do dia gerado', 'ok', 'download-simple'); }, 1300); },
  filter: (k) => { S.g.filter = k; $('#gmain').innerHTML = g2Content(); },
  row: (id) => { S.g.sel = id; S.g.offer = 0; $$('.tbl tbody tr').forEach(r => r.classList.toggle('sel', r.dataset.arg === id)); const d = $('#detail'); d.innerHTML = detailHTML(); d.firstElementChild?.classList.add('swap-in'); },
  offer: (i) => { S.g.offer = +i; $('#detail').innerHTML = detailHTML(); },
  sell: () => {
    const s = STOCK.find(x => x.id === S.g.sel), o = s.offers[S.g.offer];
    const total = o[2] * s.kg;
    openDialog({
      title: 'Confirmar venda', body: `Vender ${fmt(s.kg)} kg de ${s.n.toLowerCase()} para <b>${o[0]}</b> por <b>${brl(total)}</b> (R$ ${fmt(o[2], 2)} o kg). A coleta é agendada em seguida.`,
      actions: [
        { label: 'Cancelar', cls: 'btn-outline', fn: () => closeLayer() },
        { html: `<span class="btn-label-idle">${icon('check')}Confirmar venda</span><span class="btn-label-busy">${icon('circle-notch', 'spin')}Enviando proposta…</span>`, cls: 'btn-primary ic-l', fn: (_, b) => {
          b.classList.add('loading'); b.disabled = true; $('#dlg0').disabled = true;
          setTimeout(() => {
            S.g.sold[s.id] = { to: o[0], total };
            closeLayer();
            $('#gmain').innerHTML = g2Content();
            toast(`Venda registrada · ${brl(total)}`, 'ok', 'check-circle');
          }, 1500);
        } }
      ]
    });
  },
  person: (id) => { S.g.person = id; $('#gmain').innerHTML = g3Content(); },
  gpref: (k, b) => {
    const p = PROFILES.find(x => x.id === S.g.person);
    p.prefs[k] = !p.prefs[k]; b.setAttribute('aria-checked', p.prefs[k]); savedNote(p);
  },
  gtimer: (t, b) => {
    const p = PROFILES.find(x => x.id === S.g.person);
    p.prefs.timer = +t; $$('[data-act="gtimer"]').forEach(x => x.setAttribute('aria-checked', x === b)); savedNote(p);
  }
};

function savedNote(p) {
  const n = $('#savenote');
  n.className = 'save-note'; n.innerHTML = `${icon('circle-notch', 'spin')}Salvando…`;
  clearTimeout(savedNote.t);
  savedNote.t = setTimeout(() => {
    n.className = 'save-note ok'; n.innerHTML = `${icon('check-circle')}Salvo no crachá #${p.id}. Vale no próximo login.`;
    const tg = $('#tags-' + p.id); if (tg) tg.innerHTML = profileTags(p.prefs);
  }, 450);
}

/* ---------------------------------------------------------
   Navegação entre telas
   --------------------------------------------------------- */
/* Ao pular direto para uma seção pelo menu, deixa o estado coerente com ela */
function prepare(id) {
  S.dangerBy = 'camera';
  if (['conferir', 'corrigir', 'perigo', 'nao-identificado', 'fim-turno'].includes(id) && !S.user) {
    S.user = PROFILES[0]; S.prefs = PROFILES[0].prefs;
  }
  if (id === 'perigo') S.i = ITEMS.findIndex(x => x.danger);
  if (id === 'nao-identificado') S.i = ITEMS.findIndex(x => x.unknown);
  if ((id === 'conferir' || id === 'corrigir') && (item().danger || item().unknown)) S.i = 0;
  if (id === 'corrigir') S.fix = { from: 'conferir', pick: null };
  if (id === 'pin') S.pin = '';
  if (id === 'fim-turno') S.printed = false;
}

function go(id, { nextItem = false, fromRail = false } = {}) {
  if (!SEC[id]) id = 'entrar';
  clearTimers();
  if ($('#layer').innerHTML) { $('#layer').innerHTML = ''; S.dlg = null; }
  if (fromRail) prepare(id);
  if (id === 'pin') S.pin = '';
  if (id === 'fim-turno') S.printed = false;
  S.prevScreen = S.screen;
  S.screen = id;
  const sec = SEC[id];
  setDevice(sec.device);
  applyPrefs();

  if (WORK.has(id)) {
    const keepShell = !!$('#work') && WORK.has(S.prevScreen) && !fromRail;
    renderWork(id, { keepShell, animateCam: !keepShell || nextItem });
  } else if (sec.device === 'desktop') {
    renderGestor(id);
  } else {
    $('#host').innerHTML = SCREENS[id]();
    updateNet();
    mountTablet(id);
  }
  try { if (location.hash !== '#' + id) history.replaceState(null, '', '#' + id); } catch (e) { /* frame sem histórico */ }
  renderRail(); renderNotes();
  if (sec.device === 'tablet' && id === 'entrar') say('Mostre seu crachá para a câmera.');
}

function mountTablet(id) {
  if (id === 'fim-turno') {
    $$('[data-count]').forEach(el => countUp(el, +el.dataset.count, { dur: 1000 }));
    later(() => { const b = $('#bonusbar'); if (b) b.style.width = b.dataset.w + '%'; }, 250);
    say('Bom trabalho. Toque em imprimir para levar o seu boletim.');
  }
}

function renderGestor(id) {
  const host = $('#host');
  if (id === 'visao-geral') {
    const first = !S.g.loaded.g1;
    host.innerHTML = gShell(id, first ? g1Skeleton() : g1Content());
    const reveal = () => {
      if (first) $('#gmain').innerHTML = g1Content();
      S.g.loaded.g1 = true;
      $$('[data-count]').forEach(el => countUp(el, +el.dataset.count, { dec: +(el.dataset.dec || 0), prefix: el.dataset.prefix || '', suffix: el.dataset.suffix || '', dur: 1000 }));
      requestAnimationFrame(() => requestAnimationFrame(() => {
        $$('#chart i').forEach((b, k) => setTimeout(() => { b.style.height = b.dataset.h + 'px'; }, k * 60));
        $('#chart')?.classList.add('go');
        $$('.hbar i, .mini-bar i').forEach(b => { b.style.width = b.dataset.w + '%'; });
      }));
      const pos = [72, 41, 12];
      every(() => {
        pos.forEach((p, i) => { pos[i] = Math.min(98, p + 0.6); const t = $('#rt' + i), k = $('#rk' + i); if (t) t.style.width = pos[i] + '%'; if (k) k.style.left = pos[i] + '%'; });
      }, 1000);
      S.g.unread = 0;
      later(() => { S.g.alerts.forEach(a => { a.isNew = false; }); }, 1200);
    };
    if (first) later(reveal, 1100); else reveal();
  }
  if (id === 'estoque') {
    const first = !S.g.loaded.g2;
    host.innerHTML = gShell(id, first ? g1Skeleton().replace('Visão geral', 'Estoque e vendas').replace('Carregando os dados das 3 unidades…', 'Calculando o estoque dos itens conferidos…') : g2Content());
    if (first) later(() => { $('#gmain').innerHTML = g2Content(); S.g.loaded.g2 = true; }, 900);
  }
  if (id === 'equipe') host.innerHTML = gShell(id, g3Content());
}

/* ---------------------------------------------------------
   Shell: seções, notas, dispositivo
   --------------------------------------------------------- */
function renderRail() {
  const grp = (g, title, ic) => `<h2>${icon(ic)}${title}</h2>` + SECTIONS.filter(s => s.group === g).map(s =>
    `<button class="rail-item" data-go="${s.id}" ${S.screen === s.id ? 'aria-current="page"' : ''}><span class="code">${s.code}</span>${s.title}</button>`).join('');
  $('#rail').innerHTML = grp('t', 'Triador · tablet', 'device-tablet') + grp('g', 'Gestor · desktop', 'desktop');
}

function renderNotes() {
  const s = SEC[S.screen];
  const keys = s.keys ? `<h3>Atalhos de teclado</h3><ul style="gap:10px">
      <li style="align-items:center"><span class="kbd">S</span> sim <span class="kbd">N</span> não <span class="kbd">P</span> perigo</li>
      <li style="align-items:center"><span class="kbd">Z</span> desfazer <span class="kbd">O</span> ouvir <span class="kbd">Esc</span> fechar</li></ul>` : '';
  const badges = s.id === 'entrar' ? `<h3>Ler um crachá</h3><div class="sim">${PROFILES.slice(0, 3).map(p => `<button class="sbtn wide" data-sim="badge" data-arg="${p.id}">${icon('qr-code')}${p.name} · #${p.id}</button>`).join('')}</div>` : '';
  $('#notes').innerHTML = `<span class="eyebrow">${s.code} · ${s.group === 't' ? 'Triador no tablet' : 'Gestor no desktop'}</span>
    <h1>${s.title}</h1><p>${s.note}</p>
    <h3>Experimente</h3><ul>${s.tries.map(t => `<li>${t}</li>`).join('')}</ul>
    ${badges}${keys}
    <h3>Acessibilidade nesta versão</h3>
    <ul><li>Perfil no crachá: voz, sons, alto contraste, letra maior, painel à esquerda, tempo e menos animação.</li><li>Ícone e palavra juntos; cor nunca sozinha.</li><li>Alvos de 64 a 128 px no tablet, foco visível e anúncios para leitor de tela.</li></ul>`;
}

let currentDevice = 'tablet';
function setDevice(kind) {
  if (kind === currentDevice) return;
  currentDevice = kind;
  $('#frame').className = 'frame ' + kind;
  $('#device').className = 'device ' + kind;
  fit();
}

function fit() {
  const st = $('#stage').getBoundingClientRect();
  const dev = currentDevice === 'tablet' ? { w: 1280 + 56, h: 800 + 56 } : { w: 1442, h: 902 + 36 };
  SCALE = Math.min((st.width - 48) / dev.w, (st.height - 48) / dev.h, 1);
  const inner = $('#stage-inner');
  inner.style.width = dev.w + 'px'; inner.style.height = dev.h + 'px';
  inner.style.transform = `translate(-50%, -50%) scale(${SCALE})`;
}

/* ---------------------------------------------------------
   Teclado
   --------------------------------------------------------- */
function onKey(e) {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const k = e.key.toLowerCase();
  if (k === 'escape') { if ($('#layer').innerHTML) { closeLayer(); e.preventDefault(); } return; }
  if ($('#layer').innerHTML) return;
  if (S.screen === 'pin') {
    if (/^[0-9]$/.test(k)) act.key(k);
    if (k === 'backspace') act.key('del');
    return;
  }
  const ready = (a) => !!$(`#panel [data-act="${a}"]`);
  if (S.screen === 'conferir' && ready('yes')) { if (k === 's') act.yes(); if (k === 'n') act.no(); if (k === 'p') act.flag(); }
  if (S.screen === 'perigo' && ready('d-yes')) { if (k === 's') act['d-yes'](); if (k === 'n') act['d-no'](); }
  if (S.screen === 'nao-identificado' && ready('know')) { if (k === 's') act.know(); if (k === 'n') act.dontknow(); }
  if (S.screen === 'corrigir' && ready('pick')) {
    if (/^[1-9]$/.test(k)) act.pick(MATERIALS[+k - 1].id);
    if (k === 'enter' && S.fix.pick) act['fix-ok']();
  }
  if (WORK.has(S.screen)) { if (k === 'z') act.undo(); if (k === 'o') act.listen(); }
}

/* ---------------------------------------------------------
   Início
   --------------------------------------------------------- */
function init() {
  $('#brand-logo').innerHTML = LOGO;
  $('#reset').innerHTML = `${icon('arrow-counter-clockwise')}Reiniciar`;
  updateNet();

  const device = $('#device');
  device.addEventListener('pointerdown', ripple);
  device.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (!b || !device.contains(b) || b.disabled) return;
    const a = b.dataset.act, arg = b.dataset.arg;
    if (S.dlg && S.dlg[a]) { S.dlg[a](arg, b, e); return; }
    if (act[a]) act[a](arg, b, e);
  });
  device.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('tr[data-act]')) { e.preventDefault(); e.target.click(); }
  });
  $('#rail').addEventListener('click', (e) => { const b = e.target.closest('[data-go]'); if (b) go(b.dataset.go, { fromRail: true }); });
  $('#notes').addEventListener('click', (e) => {
    const b = e.target.closest('[data-sim]'); if (!b) return;
    if (b.dataset.sim === 'badge') {
      if (S.screen !== 'entrar') go('entrar');
      setTimeout(() => act.scan(b.dataset.arg), 300);
    }
  });
  $('#net-toggle').addEventListener('click', () => setNet(!S.online));
  $('#notes-toggle').addEventListener('click', () => $('#shell').classList.toggle('show-notes'));
  $('#reset').addEventListener('click', () => { location.hash = '#entrar'; location.reload(); });
  document.addEventListener('keydown', onKey);
  window.addEventListener('resize', fit);
  window.addEventListener('hashchange', () => { const id = location.hash.slice(1); if (id && id !== S.screen && SEC[id]) go(id, { fromRail: true }); });
  if ('speechSynthesis' in window) speechSynthesis.getVoices();

  fit();
  const start = location.hash.slice(1);
  go(SEC[start] ? start : 'entrar', { fromRail: true });
}

document.addEventListener('DOMContentLoaded', init);
