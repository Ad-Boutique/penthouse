/* V.COURT — site behavior */
(function () {
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const $  = (sel, ctx = document) => ctx.querySelector(sel);

  // ---- Preloader ----------------------------------------------------------
  function runPreloader() {
    const pre = $('#preloader');
    if (!pre) { document.body.classList.remove('is-loading'); return; }
    document.body.classList.add('is-loading');
    // tick start
    requestAnimationFrame(() => requestAnimationFrame(() => pre.classList.add('is-anim')));
    // finish
    setTimeout(() => {
      pre.classList.add('is-done');
      document.body.classList.remove('is-loading');
      // trigger first reveals on hero now
      document.documentElement.classList.add('intro-done');
      window.dispatchEvent(new Event('vc:intro-done'));
    }, 2300);
    setTimeout(() => { pre.remove(); }, 3600);
  }

  // ---- Header scroll color swap ------------------------------------------
  function headerScroll() {
    const hdr = $('.site-header');
    if (!hdr) return;
    const hero = $('[data-hero]');
    const onScroll = () => {
      const threshold = hero ? hero.offsetHeight - 80 : 80;
      hdr.classList.toggle('is-light', window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---- Reveal observer ----------------------------------------------------
  function setupReveals() {
    const els = $$('[data-reveal], [data-reveal-children], .mask-reveal, .type-reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => io.observe(el));
  }

  // Wrap words for type-reveal
  function prepareTypeReveals() {
    $$('.type-reveal').forEach((el) => {
      if (el.dataset.prepped) return;
      el.dataset.prepped = '1';
      const lines = el.querySelectorAll('[data-line]').length ? $$('[data-line]', el) : [el];
      lines.forEach((line) => {
        const text = line.textContent;
        line.textContent = '';
        text.trim().split(/\s+/).forEach((word, i) => {
          const w = document.createElement('span');
          w.className = 'word';
          const inner = document.createElement('span');
          inner.style.setProperty('--delay', (i * 70) + 'ms');
          inner.textContent = word;
          w.appendChild(inner);
          line.appendChild(w);
          if (i < text.trim().split(/\s+/).length - 1) line.appendChild(document.createTextNode(' '));
        });
      });
    });
  }

  // ---- Magnetic buttons --------------------------------------------------
  function magnetics() {
    if (!matchMedia('(hover:hover)').matches) return;
    $$('.magnetic').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.18}px, ${y * 0.22}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  // ---- Parallax ----------------------------------------------------------
  function parallax() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const items = $$('[data-parallax]').map((el) => ({ el, speed: parseFloat(el.dataset.parallax) || 0.18 }));
    if (!items.length) return;
    let lastY = window.scrollY;
    const tick = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) < 0.5) { requestAnimationFrame(tick); return; }
      lastY = y;
      items.forEach(({ el, speed }) => {
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2 - window.innerHeight / 2;
        el.style.transform = `translate3d(0, ${(-center * speed).toFixed(2)}px, 0)`;
      });
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // ---- Marquee duplication ----------------------------------------------
  function setupMarquees() {
    $$('.marquee-track').forEach((track) => {
      if (track.dataset.dup) return;
      track.dataset.dup = '1';
      const clone = track.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.parentElement.appendChild(clone);
    });
  }

  // ---- Counter animation (key facts) -------------------------------------
  function setupCounters() {
    const els = $$('[data-count]');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const el = e.target;
        const to = parseFloat(el.dataset.count);
        const decimals = (el.dataset.count.split('.')[1] || '').length;
        const dur = 1400;
        const start = performance.now();
        const startVal = 0;
        function frame(now) {
          const p = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          const v = startVal + (to - startVal) * eased;
          el.textContent = decimals ? v.toFixed(decimals) : Math.round(v).toString();
          if (p < 1) requestAnimationFrame(frame);
          else el.textContent = decimals ? to.toFixed(decimals) : Math.round(to).toString();
        }
        requestAnimationFrame(frame);
      });
    }, { threshold: 0.6 });
    els.forEach((el) => io.observe(el));
  }

  // ---- Cursor dot (subtle premium feel) ----------------------------------
  function cursorDot() {
    if (!matchMedia('(hover:hover) and (pointer: fine)').matches) return;
    const dot = document.createElement('div');
    dot.className = 'lf-cursor';
    document.body.appendChild(dot);
    let tx = 0, ty = 0, x = 0, y = 0;
    document.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });
    const tick = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      dot.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%)`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    $$('a, button, .chip, .unit-card').forEach((el) => {
      el.addEventListener('mouseenter', () => dot.style.transform += ' scale(3)');
      el.addEventListener('mouseleave', () => dot.style.transform = dot.style.transform.replace(' scale(3)', ''));
    });
  }

  // ---- Lead form: chip selection -----------------------------------------
  function chipGroups() {
    $$('[data-chipgroup]').forEach((group) => {
      const input = $('input[type="hidden"]', group);
      $$('.chip', group).forEach((chip) => {
        chip.addEventListener('click', () => {
          $$('.chip', group).forEach((c) => c.setAttribute('aria-pressed', 'false'));
          chip.setAttribute('aria-pressed', 'true');
          if (input) input.value = chip.dataset.value || chip.textContent.trim();
        });
      });
    });
  }

  // ---- Init --------------------------------------------------------------
  function init() {
    runPreloader();
    prepareTypeReveals();
    setupReveals();
    headerScroll();
    magnetics();
    parallax();
    setupMarquees();
    setupCounters();
    chipGroups();
    cursorDot();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  // Expose for tweak panel
  window.VC = window.VC || {};
  window.VC.refresh = () => { setupReveals(); magnetics(); };
})();
