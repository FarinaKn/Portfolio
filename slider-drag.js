(function () {
  var SVG_L = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var SVG_R = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2l5 5-5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  document.querySelectorAll('.slider-wrap').forEach(function (wrap) {
    var track = wrap.querySelector('.slider-track');
    if (!track) return;

    /* wrap in container so arrows sit outside the mask */
    var container = document.createElement('div');
    container.className = 'slider-container';
    wrap.parentNode.insertBefore(container, wrap);
    container.appendChild(wrap);

    var lBtn = document.createElement('button');
    lBtn.className = 'slider-arrow slider-arrow-l';
    lBtn.setAttribute('aria-label', 'Scroll left');
    lBtn.innerHTML = SVG_L;

    var rBtn = document.createElement('button');
    rBtn.className = 'slider-arrow slider-arrow-r';
    rBtn.setAttribute('aria-label', 'Scroll right');
    rBtn.innerHTML = SVG_R;

    /* order: [lBtn] [slider-wrap] [rBtn] */
    container.insertBefore(lBtn, wrap);
    container.appendChild(rBtn);

    /* ── scroll engine ── */
    var raf = null;

    function getTX() {
      var m = window.getComputedStyle(track).transform;
      return (m === 'none') ? 0 : new DOMMatrix(m).m41;
    }

    function startScroll(dir) {
      /* freeze the CSS animation and take over with rAF */
      var x = getTX();
      var hw = track.offsetWidth / 2 || 1;
      track.style.animation = 'none';
      track.style.transform = 'translateX(' + x + 'px)';

      cancelAnimationFrame(raf);
      (function tick() {
        var cur = getTX();
        var nx = cur + dir * 5;        /* infinite wrap */
        while (nx > 0)   nx -= hw;
        while (nx < -hw) nx += hw;
        track.style.transform = 'translateX(' + nx + 'px)';
        raf = requestAnimationFrame(tick);
      }());
    }

    function stopScroll() {
      cancelAnimationFrame(raf);
      raf = null;

      /* resume CSS animation from current position */
      var hw  = track.offsetWidth / 2 || 1;
      var ex  = getTX();
      track.style.animation = '';
      var dur = parseFloat(window.getComputedStyle(track).animationDuration) || 60;
      var p   = Math.abs(ex) / hw;
      void track.getBoundingClientRect();            /* force reflow */
      track.style.animationDelay       = -(p * dur) + 's';
      track.style.animationPlayState   = 'running';

      /* hand control back to CSS hover rule once cursor leaves */
      track.addEventListener('mouseleave', function once() {
        track.style.animationPlayState = '';
        track.removeEventListener('mouseleave', once);
      });
    }

    function bind(btn, dir) {
      /* mouse: hold to scroll */
      btn.addEventListener('mousedown',  function (e) { e.preventDefault(); startScroll(dir); });
      btn.addEventListener('mouseup',    stopScroll);
      btn.addEventListener('mouseleave', stopScroll);
      /* touch: tap/hold to scroll */
      btn.addEventListener('touchstart', function (e) { e.preventDefault(); startScroll(dir); }, { passive: false });
      btn.addEventListener('touchend',   stopScroll);
      btn.addEventListener('touchcancel',stopScroll);
    }

    bind(lBtn,  3);   /* left  = scroll backwards  */
    bind(rBtn, -3);   /* right = scroll forwards (faster) */
  });
})();
