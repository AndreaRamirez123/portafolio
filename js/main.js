(function () {
  /* absolute failsafe: the loader must never stay stuck, no matter what else happens below */
  function hideLoader() {
    var loader = document.getElementById('apr-loader');
    if (loader) { loader.classList.add('apr-hidden'); }
  }
  setTimeout(hideLoader, 2600);

  function whenReady(ids, cb, triesLeft) {
    triesLeft = triesLeft == null ? 60 : triesLeft;
    var allPresent = ids.every(function (id) { return document.getElementById(id); });
    if (allPresent || triesLeft <= 0) { cb(); return; }
    setTimeout(function () { whenReady(ids, cb, triesLeft - 1); }, 50);
  }

  function initLoaderProgress() {
    var progressEl = document.getElementById('apr-progress');
    var pctEl = document.getElementById('apr-progress-pct');
    if (!progressEl || !pctEl) return;
    var p = 0;
    var iv = setInterval(function () {
      p += Math.random() * 16 + 6;
      if (p >= 100) { p = 100; clearInterval(iv); setTimeout(hideLoader, 300); }
      progressEl.style.width = p + '%';
      pctEl.textContent = Math.floor(p) + '%';
    }, 90);
  }

  function initMatrix() {
    var canvas = document.getElementById('apr-matrix');
    var hero = document.getElementById('inicio');
    if (!canvas || !hero) return;
    var ctx = canvas.getContext('2d');
    var chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    var fontSize = 14;
    var drops = [];
    function sizeCanvas() { canvas.width = hero.clientWidth || window.innerWidth; canvas.height = hero.clientHeight || window.innerHeight; }
    function initDrops() { var cols = Math.floor(canvas.width / fontSize) || 1; drops = []; for (var i = 0; i < cols; i++) { drops[i] = Math.random() * -50; } }
    sizeCanvas(); initDrops();
    window.addEventListener('resize', function () { sizeCanvas(); initDrops(); });
    setInterval(function () {
      ctx.fillStyle = 'rgba(10,14,26,0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#B14EFF';
      ctx.font = fontSize + 'px monospace';
      for (var i = 0; i < drops.length; i++) {
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) { drops[i] = 0; }
        drops[i]++;
      }
    }, 40);
  }

  function initNavAndReveal() {
    var scroller = document.getElementById('apr-scroll');
    if (!scroller) return;
    var sections = document.querySelectorAll('.apr-section');
    var navlinks = document.querySelectorAll('#apr-navlinks a');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          var id = entry.target.id;
          navlinks.forEach(function (l) { l.classList.toggle('apr-active', l.getAttribute('data-name') === id); });
        }
      });
    }, { root: scroller, threshold: [0.5] });
    sections.forEach(function (s) { io.observe(s); });

    var revIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { if (entry.isIntersecting) { entry.target.classList.add('apr-in'); revIo.unobserve(entry.target); } });
    }, { root: scroller, threshold: 0.15 });
    var revealEls = document.querySelectorAll('.apr-reveal');
    /* only mark elements as pending (invisible) right before observing them —
       if this code never runs, elements simply keep their default visible CSS state */
    revealEls.forEach(function (el) { el.classList.add('apr-pending'); revIo.observe(el); });
    setTimeout(function () { revealEls.forEach(function (el) { el.classList.add('apr-in'); }); }, 3500);
  }

  function initStatCounters() {
    var nums = document.querySelectorAll('.apr-stat-num');
    if (!nums.length) return;
    var scroller = document.getElementById('apr-scroll');
    function run(el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      el.textContent = '0';
      var cur = 0;
      var step = Math.max(1, Math.round(target / 40));
      var t = setInterval(function () {
        cur += step;
        if (cur >= target) { cur = target; clearInterval(t); }
        el.textContent = cur;
      }, 35);
    }
    var statIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { if (entry.isIntersecting) { run(entry.target); statIo.unobserve(entry.target); } });
    }, { root: scroller || null, threshold: 0.5 });
    nums.forEach(function (el) { statIo.observe(el); });
  }

  function initSlider() {
    var track = document.getElementById('apr-ptrack');
    var dotsWrap = document.getElementById('apr-dots');
    var curEl = document.getElementById('apr-cur');
    var pfill = document.getElementById('apr-pfill');
    var prevBtn = document.getElementById('apr-prev');
    var nextBtn = document.getElementById('apr-next');
    if (!track || !dotsWrap || !prevBtn || !nextBtn) return;
    var slides = track.querySelectorAll('.apr-pslide');
    var total = slides.length;
    var cur = 0;
    slides.forEach(function (_, i) {
      var d = document.createElement('span');
      if (i === 0) d.classList.add('apr-active');
      d.addEventListener('click', function () { goTo(i); });
      dotsWrap.appendChild(d);
    });
    function render() {
      track.style.transform = 'translateX(-' + (cur * 100) + '%)';
      if (curEl) curEl.textContent = String(cur + 1).padStart(2, '0');
      if (pfill) pfill.style.width = (((cur + 1) / total) * 100) + '%';
      dotsWrap.querySelectorAll('span').forEach(function (d, i) { d.classList.toggle('apr-active', i === cur); });
    }
    function goTo(i) { cur = (i + total) % total; render(); }
    prevBtn.addEventListener('click', function () { goTo(cur - 1); });
    nextBtn.addEventListener('click', function () { goTo(cur + 1); });
    var autoSlide = setInterval(function () { goTo(cur + 1); }, 6000);
    track.addEventListener('mouseenter', function () { clearInterval(autoSlide); });
    var touchStartX = 0;
    track.addEventListener('touchstart', function (e) { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function (e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { goTo(diff > 0 ? cur + 1 : cur - 1); }
    }, { passive: true });
  }

  function initContactForm() {
    var form = document.getElementById('apr-contact-form');
    var statusEl = document.getElementById('apr-f-status');
    var submitBtn = document.getElementById('apr-f-submit');
    var submitLabel = submitBtn ? submitBtn.querySelector('.apr-f-submit-label') : null;
    if (!form) return;

    function setStatus(text, color) {
      if (!statusEl) return;
      statusEl.textContent = text;
      statusEl.style.color = color || '#64748B';
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var accessKey = (form.querySelector('[name="access_key"]') || {}).value || '';
      if (!accessKey || accessKey.indexOf('REEMPLAZA_CON_TU_ACCESS_KEY') !== -1) {
        setStatus('// falta configurar la access key de Web3Forms en el formulario', '#FF4757');
        return;
      }
      if (submitBtn) submitBtn.disabled = true;
      if (submitLabel) submitLabel.textContent = 'ENVIANDO...';
      setStatus('// enviando mensaje...');

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.success) {
            setStatus('// ¡mensaje enviado! te responderá pronto.', '#51CF66');
            form.reset();
          } else {
            setStatus('// no se pudo enviar, intenta por WhatsApp o email directo', '#FF4757');
          }
        })
        .catch(function () {
          setStatus('// error de conexión, intenta por WhatsApp o email directo', '#FF4757');
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
          if (submitLabel) submitLabel.textContent = 'ENVIAR MENSAJE';
        });
    });
  }

  function safe(fn) { try { fn(); } catch (e) { if (window.console) console.error(e); } }

  function setupAll() {
    if (window.__aprInited) return;
    window.__aprInited = true;
    safe(initLoaderProgress);
    safe(initMatrix);
    safe(initNavAndReveal);
    safe(initStatCounters);
    safe(initSlider);
    safe(initContactForm);
  }

  whenReady(['apr-scroll', 'apr-ptrack', 'apr-loader'], setupAll);
  window.addEventListener('load', function () { setTimeout(setupAll, 50); });
})();
