/* V.COURT — Tweaks panel
 * Lightweight design-time controls (color scheme, headline font, CTA style).
 * No React — vanilla DOM, ~6 KB.
 */
(function () {
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "scheme": "offwhite",
    "headlineFont": "blacker",
    "ctaStyle": "block"
  }/*EDITMODE-END*/;

  const STORE_KEY = "vc.tweaks.v2";
  const state = Object.assign({}, TWEAK_DEFAULTS, readStored());

  function readStored() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || "{}"); } catch (e) { return {}; }
  }
  function persist() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  // ---- Apply ----
  function apply() {
    const body = document.body;
    body.classList.remove('scheme-offwhite','scheme-stone','scheme-graphite');
    body.classList.add('scheme-' + state.scheme);

    body.classList.remove('font-fraunces','font-tenor','font-bodoni','font-cormorant','font-blacker');
    body.classList.add('font-' + state.headlineFont);
    const root = document.documentElement.style;
    if (state.headlineFont === 'blacker')   root.setProperty('--font-display', '"Blacker Display", "Fraunces", "Cormorant Garamond", serif');
    if (state.headlineFont === 'fraunces')  root.setProperty('--font-display', '"Fraunces", "Cormorant Garamond", serif');
    if (state.headlineFont === 'tenor')     root.setProperty('--font-display', '"Tenor Sans", "Cormorant Garamond", serif');
    if (state.headlineFont === 'bodoni')    root.setProperty('--font-display', '"Bodoni Moda", "Didot", serif');
    if (state.headlineFont === 'cormorant') root.setProperty('--font-display', '"Cormorant Garamond", "Fraunces", serif');

    body.classList.remove('cta-block','cta-pill','cta-underline');
    body.classList.add('cta-' + state.ctaStyle);
  }

  // ---- Panel UI ----
  function buildPanel() {
    const el = document.createElement('aside');
    el.id = 'vc-tweaks';
    el.innerHTML = `
      <div class="tw-head">
        <span>Tweaks</span>
        <button class="tw-close" aria-label="Schließen">&times;</button>
      </div>
      <div class="tw-section">
        <label>Farbschema</label>
        <div class="tw-row" data-group="scheme">
          <button data-val="offwhite"><span style="background:#F5F1E8"></span>Off-White</button>
          <button data-val="stone"><span style="background:#ECE6D8"></span>Stone</button>
          <button data-val="graphite"><span style="background:#EDE9DF"></span>Warm Graphite</button>
        </div>
      </div>
      <div class="tw-section">
        <label>Display-Schrift</label>
        <div class="tw-row tw-col" data-group="headlineFont">
          <button data-val="blacker" style="font-family:'Blacker Display',serif">Blacker</button>
          <button data-val="fraunces" style="font-family:'Fraunces',serif">Fraunces</button>
          <button data-val="tenor" style="font-family:'Tenor Sans',serif">Tenor Sans</button>
          <button data-val="bodoni" style="font-family:'Bodoni Moda',serif">Bodoni Moda</button>
          <button data-val="cormorant" style="font-family:'Cormorant Garamond',serif">Cormorant</button>
        </div>
      </div>
      <div class="tw-section">
        <label>CTA-Stil</label>
        <div class="tw-row" data-group="ctaStyle">
          <button data-val="block">Block</button>
          <button data-val="pill">Pill</button>
          <button data-val="underline">Linie</button>
        </div>
      </div>
      <div class="tw-foot">V.COURT · Design tweaks</div>
    `;
    document.body.appendChild(el);

    const css = document.createElement('style');
    css.textContent = `
      #vc-tweaks { position: fixed; right: 24px; bottom: 24px; z-index: 200; width: 300px;
        background: #14241B; color: #F5F1E8; font-family: var(--font-ui);
        padding: 18px 18px 14px; box-shadow: 0 24px 60px rgba(0,0,0,0.35);
        transform: translateY(20px) scale(.98); opacity: 0; pointer-events: none;
        transition: opacity 240ms var(--ease, ease-out), transform 240ms var(--ease, ease-out);
      }
      #vc-tweaks.is-open { opacity: 1; transform: none; pointer-events: auto; }
      #vc-tweaks .tw-head { display:flex; justify-content:space-between; align-items:center;
        font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; margin-bottom: 14px;
        padding-bottom: 12px; border-bottom: 1px solid rgba(245,241,232,0.15); }
      #vc-tweaks .tw-close { font-size: 20px; line-height: 1; opacity: 0.6; }
      #vc-tweaks .tw-close:hover { opacity: 1; }
      #vc-tweaks label { display:block; font-size: 10px; letter-spacing: 0.18em;
        text-transform: uppercase; color: rgba(245,241,232,0.55); margin: 14px 0 8px; }
      #vc-tweaks .tw-row { display:flex; gap:6px; flex-wrap:wrap; }
      #vc-tweaks .tw-row.tw-col { flex-direction: column; gap: 4px; }
      #vc-tweaks .tw-row button { display:inline-flex; align-items:center; gap:8px;
        padding: 8px 10px; font-size: 12px; background: transparent; color: inherit;
        border: 1px solid rgba(245,241,232,0.18); border-radius: 0;
        transition: all 180ms ease; flex: 1; justify-content: center; }
      #vc-tweaks .tw-col button { justify-content: flex-start; padding: 10px 12px; font-size: 14px; }
      #vc-tweaks .tw-row button:hover { border-color: rgba(245,241,232,0.45); }
      #vc-tweaks .tw-row button.is-on { background: #F5F1E8; color: #14241B; border-color: #F5F1E8; }
      #vc-tweaks .tw-row button span { width:14px; height:14px; display:inline-block; border:1px solid rgba(0,0,0,0.1); }
      #vc-tweaks .tw-foot { margin-top: 18px; font-size: 10px; letter-spacing: 0.18em;
        text-transform: uppercase; color: rgba(245,241,232,0.4); }

      .vc-tweaks-toggle { position: fixed; right: 24px; bottom: 24px; z-index: 199;
        width: 48px; height: 48px; border-radius: 50%; background: #14241B; color: #F5F1E8;
        display:flex; align-items:center; justify-content:center; cursor:pointer;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3); transition: transform 220ms;
        font-family: var(--font-display, serif); font-size: 18px; }
      .vc-tweaks-toggle:hover { transform: scale(1.06); }
      .vc-tweaks-toggle.is-hidden { display:none; }
    `;
    document.head.appendChild(css);

    // toggle button
    const toggle = document.createElement('button');
    toggle.className = 'vc-tweaks-toggle';
    toggle.setAttribute('aria-label', 'Tweaks öffnen');
    toggle.innerHTML = '<span style="font-style:italic">V/C</span>';
    document.body.appendChild(toggle);

    toggle.addEventListener('click', () => { open(); });
    el.querySelector('.tw-close').addEventListener('click', () => close());

    el.querySelectorAll('[data-group]').forEach((row) => {
      const key = row.dataset.group;
      row.querySelectorAll('button').forEach((btn) => {
        btn.addEventListener('click', () => {
          state[key] = btn.dataset.val;
          syncButtons();
          apply();
          persist();
          try { window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [key]: btn.dataset.val } }, '*'); } catch (e) {}
        });
      });
    });

    function syncButtons() {
      el.querySelectorAll('[data-group]').forEach((row) => {
        const key = row.dataset.group;
        row.querySelectorAll('button').forEach((b) => {
          b.classList.toggle('is-on', b.dataset.val === state[key]);
        });
      });
    }

    function open() { el.classList.add('is-open'); toggle.classList.add('is-hidden'); }
    function close() { el.classList.remove('is-open'); toggle.classList.remove('is-hidden');
      try { window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); } catch (e) {} }

    window.addEventListener('message', (ev) => {
      const d = ev.data;
      if (!d || typeof d !== 'object') return;
      if (d.type === '__activate_edit_mode') open();
      else if (d.type === '__deactivate_edit_mode') close();
    });
    try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch (e) {}

    syncButtons();
  }

  function init() {
    apply();
    buildPanel();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
