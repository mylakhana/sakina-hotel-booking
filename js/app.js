/* ============================================================
   Sakina — shared runtime (all pages)
   ============================================================ */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

const qs = new URLSearchParams(location.search);
const store = {
  get(k, d) { try { return JSON.parse(sessionStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { sessionStorage.setItem(k, JSON.stringify(v)); },
};

const fmtSAR = n => 'SAR ' + Math.round(n).toLocaleString('en-US');
const pluralize = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
const nightsBetween = (a, b) => Math.max(1, Math.round((new Date(b) - new Date(a)) / 86400000));
const debounce = (fn, ms = 120) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

function refreshIcons() { if (window.lucide) lucide.createIcons(); }

/* ---------- Search params (shared defaults) ---------- */
function tripParams() {
  return {
    city: qs.get('city') || 'Makkah',
    in: qs.get('in') || DEFAULT_DATES.in,
    out: qs.get('out') || DEFAULT_DATES.out,
    guests: parseInt(qs.get('guests') || '2', 10),
    type: qs.get('type') || 'any',
  };
}
function searchHref(over = {}) {
  const p = { ...tripParams(), ...over };
  const q = new URLSearchParams(p).toString();
  return `search.html?${q}`;
}

/* ---------- Header ---------- */
function initHeader() {
  const header = $('#siteHeader');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  const btn = $('#menuBtn'), panel = $('#mobileMenu');
  if (btn && panel) {
    const close = () => { panel.classList.add('hidden'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => {
      const open = panel.classList.toggle('hidden');
      btn.setAttribute('aria-expanded', String(!open));
    });
    panel.addEventListener('click', e => { if (e.target.closest('a')) close(); });
    document.addEventListener('click', e => {
      if (!panel.classList.contains('hidden') && !e.target.closest('#mobileMenu') && !e.target.closest('#menuBtn')) close();
    });
  }
}

/* ---------- Unsplash fallback ---------- */
const FALLBACK_POOL = [U.roomLux, U.lobby, U.pool, U.ext, U.bedroom];
window.addEventListener('error', e => {
  const t = e.target;
  if (!(t instanceof HTMLImageElement)) return;
  const n = parseInt(t.dataset.fb || '0', 10);
  if (n >= FALLBACK_POOL.length) { t.style.background = 'linear-gradient(135deg,#dcf3e8,#b8e6d3)'; t.removeAttribute('src'); return; }
  t.dataset.fb = String(n + 1);
  t.src = img(FALLBACK_POOL[n], 900);
}, true);

/* ---------- Toast ---------- */
let toastEl = null, toastTimer = null;
function toast(msg, icon = 'check-circle-2') {
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.className = 'toast';
    toastEl.setAttribute('role', 'status');
    document.body.appendChild(toastEl);
  }
  toastEl.innerHTML = `<i data-lucide="${icon}" class="w-4 h-4 shrink-0" style="color:#7fd8b7"></i><span>${msg}</span>`;
  refreshIcons();
  // force reflow so repeated toasts re-animate
  toastEl.classList.remove('show');
  void toastEl.offsetWidth;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
}

/* ---------- Origin-aware popover ---------- */
function initPopovers(root = document) {
  $$('[data-pop-text]', root).forEach(el => {
    if (el.dataset.popBound) return;
    el.dataset.popBound = '1';
    const above = el.hasAttribute('data-pop-above');
    const pop = document.createElement('div');
    pop.className = `pop ${above ? 'pop-above' : 'pop-below'}`;
    pop.innerHTML = el.getAttribute('data-pop-text');
    el.appendChild(pop);
    let hideT;
    const show = () => { clearTimeout(hideT); $$('.pop.open', el).forEach(p => p.classList.remove('open')); pop.classList.add('open'); };
    const hide = () => { hideT = setTimeout(() => pop.classList.remove('open'), 60); };
    el.addEventListener('mouseenter', show);
    el.addEventListener('mouseleave', hide);
    el.addEventListener('focus', show);
    el.addEventListener('blur', hide);
  });
}

/* ---------- Modal helpers ---------- */
function openModal(id) {
  const scrim = $('#scrim'), card = $(`#${id}`);
  if (!scrim || !card) return;
  scrim.classList.add('open');
  card.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  const scrim = $('#scrim'), card = $(`#${id}`);
  if (!scrim || !card) return;
  scrim.classList.remove('open');
  card.classList.remove('open');
  document.body.style.overflow = '';
}
function initModals() {
  const scrim = $('#scrim');
  if (scrim) scrim.addEventListener('click', () => $$('.modal-card.open').forEach(m => closeModal(m.id)));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { $$('.modal-card.open').forEach(m => closeModal(m.id)); closeSheet(); }
  });
  $$('[data-close-modal]').forEach(b => b.addEventListener('click', () => closeModal(b.dataset.closeModal)));
}

/* ---------- Sheet (map drawer) ---------- */
function openSheet(id) {
  const s = $(`#${id}`);
  if (!s) return;
  s.classList.add('open');
  $('#scrim')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeSheet() {
  $$('.sheet.open').forEach(s => s.classList.remove('open'));
  if (!$$('.modal-card.open').length) {
    $('#scrim')?.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* ---------- Scroll reveal ---------- */
function initReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { rootMargin: '-40px' });
  $$('.reveal').forEach(el => io.observe(el));
}

/* ---------- Sign-in (mock) ---------- */
function initSignIn() {
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div id="scrim" class="scrim"></div>
    <div id="signInModal" class="modal-card" role="dialog" aria-modal="true" aria-label="Sign in">
      <div class="bg-white rounded-3xl shadow-2xl w-[min(92vw,400px)] p-8 text-center">
        <div class="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center" style="background:#dcf3e8">
          <i data-lucide="user-round" class="w-7 h-7" style="color:#0b5843"></i>
        </div>
        <h3 class="h3 text-xl font-semibold mt-5">Sign in to Sakina</h3>
        <p class="muted text-sm mt-2 leading-relaxed">Manage your bookings, save rooms and track vouchers — all in one place.</p>
        <button class="btn btn-primary btn-lg w-full mt-6" data-close-modal="signInModal">Continue with email</button>
        <button class="btn btn-outline btn-md w-full mt-2.5" data-close-modal="signInModal">Continue with phone</button>
        <p class="text-[11.5px] muted mt-5">Interactive prototype — authentication is not wired up.</p>
      </div>
    </div>`;
  document.body.appendChild(wrap);
  refreshIcons();
  initModals();
  $$('[data-signin]').forEach(b => b.addEventListener('click', () => openModal('signInModal')));
}

/* ---------- Shared header markup ---------- */
function mountHeader(active) {
  const navs = [
    { label: 'Makkah', href: searchHref({ city: 'Makkah' }), key: 'makkah' },
    { label: 'Madinah', href: searchHref({ city: 'Madinah' }), key: 'madinah' },
    { label: 'Shared rooms', href: searchHref({ type: 'shared' }), key: 'shared' },
    { label: 'How it works', href: 'index.html#how', key: 'how' },
  ];
  const link = n => `<a href="${n.href}" class="px-3.5 py-2 rounded-full text-sm font-medium transition-colors duration-150 ${active === n.key ? 'text-[#0b5843] bg-[#dcf3e8]' : 'text-[#1d1d1f]/75 hover:text-[#1d1d1f] hover:bg-black/5'}">${n.label}</a>`;
  const el = document.createElement('div');
  el.innerHTML = `
  <header id="siteHeader" class="fixed top-0 inset-x-0 z-40 glass border-b border-black/[0.06]">
    <div class="max-w-6xl mx-auto px-5 h-16 flex items-center gap-7">
      <a href="index.html" class="flex items-center gap-2.5 shrink-0" aria-label="Sakina home">
        <span class="w-8 h-8 rounded-[10px] flex items-center justify-center shadow-sm" style="background:#0d6e53">
          <svg width="16" height="16" viewBox="0 0 32 32" fill="none"><path d="M20.5 5.5A11.2 11.2 0 1 0 26.4 20 9.3 9.3 0 0 1 20.5 5.5Z" fill="#fff"/></svg>
        </span>
        <span class="text-[17px] font-semibold tracking-tight">Sakina</span>
      </a>
      <nav class="hidden md:flex items-center gap-1">${navs.map(link).join('')}</nav>
      <div class="ml-auto flex items-center gap-2.5">
        <button data-signin class="btn btn-ghost btn-sm hidden sm:inline-flex" aria-label="Sign in">
          <i data-lucide="user-round" class="w-4 h-4"></i>Sign in
        </button>
        <button data-signin class="btn btn-primary btn-sm hidden sm:inline-flex">My bookings</button>
        <button id="menuBtn" class="btn btn-ghost btn-icon md:hidden" aria-label="Menu" aria-expanded="false">
          <i data-lucide="menu" class="w-5 h-5"></i>
        </button>
      </div>
    </div>
    <div id="mobileMenu" class="hidden md:hidden glass-strong border-t border-black/5 px-5 py-4">
      <div class="flex flex-col gap-1">${navs.map(n => `<a href="${n.href}" class="px-3 py-2.5 rounded-xl text-[15px] font-medium hover:bg-black/5">${n.label}</a>`).join('')}
        <button data-signin class="btn btn-primary btn-md mt-2 w-full">Sign in</button>
      </div>
    </div>
  </header>`;
  document.body.prepend(el.firstElementChild);
}

/* ---------- Shared footer ---------- */
function mountFooter() {
  const el = document.createElement('footer');
  el.className = 'border-t border-black/[0.06] mt-24 bg-white/60';
  el.innerHTML = `
  <div class="max-w-6xl mx-auto px-5 py-14">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-10">
      <div>
        <div class="flex items-center gap-2.5">
          <span class="w-7 h-7 rounded-lg flex items-center justify-center" style="background:#0d6e53">
            <svg width="14" height="14" viewBox="0 0 32 32" fill="none"><path d="M20.5 5.5A11.2 11.2 0 1 0 26.4 20 9.3 9.3 0 0 1 20.5 5.5Z" fill="#fff"/></svg>
          </span>
          <span class="font-semibold tracking-tight">Sakina</span>
        </div>
        <p class="muted text-[13px] mt-3.5 leading-relaxed">Pilgrim accommodation, transparently brokered. Makkah &amp; Madinah today — more cities soon.</p>
      </div>
      <div>
        <p class="eyebrow mb-3.5">Explore</p>
        <ul class="space-y-2.5 text-[13.5px] text-[#1d1d1f]/75">
          <li><a class="hover:text-[#0b5843]" href="${searchHref({ city: 'Makkah' })}">Hotels in Makkah</a></li>
          <li><a class="hover:text-[#0b5843]" href="${searchHref({ city: 'Madinah' })}">Hotels in Madinah</a></li>
          <li><a class="hover:text-[#0b5843]" href="${searchHref({ type: 'shared' })}">Shared rooms</a></li>
          <li><a class="hover:text-[#0b5843]" href="${searchHref({ type: 'private' })}">Private rooms</a></li>
        </ul>
      </div>
      <div>
        <p class="eyebrow mb-3.5">Guests</p>
        <ul class="space-y-2.5 text-[13.5px] text-[#1d1d1f]/75">
          <li><a class="hover:text-[#0b5843]" href="index.html#how">How Sakina works</a></li>
          <li><a class="hover:text-[#0b5843]" href="index.html#shared">Bed-level booking</a></li>
          <li><a class="hover:text-[#0b5843]" href="index.html#brokers">Broker offers</a></li>
          <li><a class="hover:text-[#0b5843]" href="#" onclick="return false">Help centre</a></li>
        </ul>
      </div>
      <div>
        <p class="eyebrow mb-3.5">Company</p>
        <ul class="space-y-2.5 text-[13.5px] text-[#1d1d1f]/75">
          <li><a class="hover:text-[#0b5843]" href="#" onclick="return false">About Sakina</a></li>
          <li><a class="hover:text-[#0b5843]" href="#" onclick="return false">Become a broker</a></li>
          <li><a class="hover:text-[#0b5843]" href="#" onclick="return false">Privacy</a></li>
          <li><a class="hover:text-[#0b5843]" href="#" onclick="return false">Terms</a></li>
        </ul>
      </div>
    </div>
    <div class="mt-12 pt-6 border-t border-black/[0.06] flex flex-wrap items-center gap-x-6 gap-y-2 justify-between">
      <p class="text-xs muted">© 2026 Sakina. Interactive client prototype — no real bookings or payments.</p>
      <p class="text-xs muted">Prices shown in SAR, set by individual brokers.</p>
    </div>
  </div>`;
  document.body.appendChild(el);
}

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initSignIn();
  initPopovers();
  initReveal();
  refreshIcons();
});
