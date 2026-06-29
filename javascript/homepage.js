(function () {
  // ─── DATA ────────────────────────────────────────────────────────────────
  // RUTAS se carga dinámicamente desde search.json para garantizar URLs correctas
  var RUTAS = [];

  // Carga las rutas desde el índice generado por Eleventy
  function loadRutas(callback) {
    fetch('/search.json')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        RUTAS = data.filter(function(r) { return r.trending; }).map(function(r) {
          return {
            title:       r.title,
            url:         r.url,
            images_url:  r.images_url,
            dept:        r.departamento,
            patrocinada: r.patrocinada || false
          };
        });
        callback();
      })
      .catch(function() {
        // Fallback vacío — no bloquea el resto
        callback();
      });
  }

  // Departamentos por país para el modal
  var DEPARTAMENTOS = {
    colombia: [
      "antioquia", "boyaca", "caldas", "choco", "cundinamarca",
      "huila", "inirida", "putumayo", "quindio", "risaralda",
      "santander", "tolima", "valle", "costa"
    ]
  };

  // ─── WEIGHTED RANDOM ─────────────────────────────────────────────────────
  // Las rutas patrocinadas tienen peso 3x, las normales peso 1.
  function weightedShuffle(arr) {
    var pool = [];
    arr.forEach(function (r) {
      var weight = r.patrocinada ? 3 : 1;
      for (var i = 0; i < weight; i++) pool.push(r);
    });
    // Fisher-Yates sobre el pool, luego dedup
    for (var i = pool.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
    }
    // Dedup manteniendo orden
    var seen = {};
    var result = [];
    for (var k = 0; k < pool.length; k++) {
      if (!seen[pool[k].url]) {
        seen[pool[k].url] = true;
        result.push(pool[k]);
      }
    }
    return result;
  }

  // ─── RENDER FEATURED GRID ────────────────────────────────────────────────
  function renderFeatured(filter) {
    var grid = document.getElementById('featured-grid');
    if (!grid) return;

    var pool = filter
      ? RUTAS.filter(function (r) { return r.dept === filter; })
      : RUTAS;

    if (pool.length === 0) pool = RUTAS;

    var picks = weightedShuffle(pool).slice(0, 4);

    // ── Hero aleatorio ──
    // Usa la imagen de una ruta al azar (preferiblemente distinta a las del grid)
    var heroPool = RUTAS.filter(function(r) {
      return !picks.some(function(p) { return p.url === r.url; });
    });
    if (heroPool.length === 0) heroPool = RUTAS;
    var heroPick = weightedShuffle(heroPool)[0];
    var heroEl = document.getElementById('hero-section');
    if (heroEl && heroPick && heroPick.images_url) {
      heroEl.style.backgroundImage = "url('" + heroPick.images_url + "/featured.jpg')";
    }

    // ── Grid de rutas ──
    grid.innerHTML = picks.map(function (r) {
      return '<a class="featured-card" href="' + r.url + '">' +
        '<div class="featured-card__inner">' +
          '<img src="' + r.images_url + '/featured.jpg" alt="' + r.title + '" loading="lazy" decoding="async">' +
          '<div class="featured-card__scrim"></div>' +
          '<span class="featured-card__title">' + r.title + '</span>' +
        '</div>' +
        '</a>';
    }).join('');
  }

  // ─── SEARCH ──────────────────────────────────────────────────────────────
  function initSearch() {
    var form = document.getElementById('hero-search-form');
    var input = document.getElementById('hero-search-input');
    if (!form || !input) return;

    // Autocompletado básico desde los datos en memoria
    var list = document.createElement('ul');
    list.id = 'hero-autocomplete';
    list.style.cssText = 'list-style:none;margin:0;padding:0;position:absolute;top:100%;left:0;right:0;background:#fff;border-radius:0 0 12px 12px;box-shadow:0 8px 24px rgba(0,0,0,0.12);z-index:10;display:none;';
    var wrap = form.parentElement;
    wrap.style.position = 'relative';
    wrap.appendChild(list);

    input.addEventListener('input', function () {
      var val = input.value.trim();
      list.innerHTML = '';
      list.style.display = 'none';
      if (val.length < 2) return;
      var norm = normalize(val);
      var hits = RUTAS.filter(function (r) {
        return normalize(r.title).indexOf(norm) !== -1;
      }).slice(0, 5);
      if (!hits.length) return;
      hits.forEach(function (r) {
        var li = document.createElement('li');
        li.style.cssText = 'padding:10px 20px;cursor:pointer;font-size:14px;color:#111;border-bottom:1px solid #f4f4f5;';
        li.textContent = r.title;
        li.addEventListener('mousedown', function (e) {
          e.preventDefault();
          window.location.href = '/buscar/?q=' + encodeURIComponent(r.title);
        });
        li.addEventListener('mouseover', function () { li.style.background = '#f4f4f5'; });
        li.addEventListener('mouseout',  function () { li.style.background = ''; });
        list.appendChild(li);
      });
      list.style.display = 'block';
    });

    document.addEventListener('click', function (e) {
      if (e.target !== input) list.style.display = 'none';
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = input.value.trim();
      if (q) window.location.href = '/buscar/?q=' + encodeURIComponent(q);
    });
  }

  // Helper normalize para el autocompletado del hero
  function normalize(str) {
    if (!str) return '';
    return str.toString().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  // ─── DADO MODAL ──────────────────────────────────────────────────────────
  function initDadoModal() {
    var btn     = document.getElementById('btn-dado');
    var modal   = document.getElementById('dado-modal');
    var close   = document.getElementById('dado-modal-close');
    var selPais = document.getElementById('dado-pais');
    var selDept = document.getElementById('dado-dept');
    var btnCta  = document.getElementById('dado-cta');

    if (!btn || !modal) return;

    // Pobla departamentos al inicio (Colombia pre-seleccionado)
    if (selPais && selDept && selPais.value) {
      var initDepts = DEPARTAMENTOS[selPais.value] || [];
      selDept.innerHTML = '<option value="">— Elige un departamento —</option>' +
        initDepts.map(function (d) {
          return '<option value="' + d + '">' + d.charAt(0).toUpperCase() + d.slice(1) + '</option>';
        }).join('');
      selDept.disabled = false;
    }

    // Abrir modal
    btn.addEventListener('click', function () {
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
    });

    // Cerrar modal
    function closeModal() {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
      // Reset botón
      if (btnCta) {
        btnCta.textContent = '¡Recomiéndame una aventura!';
        btnCta.disabled = false;
        btnCta.style.opacity = '';
      }
    }

    if (close) close.addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });

    // Poblar departamentos cuando cambia el país
    if (selPais && selDept) {
      selPais.addEventListener('change', function () {
        var depts = DEPARTAMENTOS[selPais.value] || [];
        selDept.innerHTML = '<option value="">— Elige un departamento —</option>' +
          depts.map(function (d) {
            return '<option value="' + d + '">' + d.charAt(0).toUpperCase() + d.slice(1) + '</option>';
          }).join('');
        selDept.disabled = false;
        if (btnCta) btnCta.textContent = '¡Recomiéndame una aventura!';
      });

      // Actualiza texto del botón al elegir departamento (opcional)
      selDept.addEventListener('change', function () {
        if (!btnCta) return;
        if (selDept.value) {
          btnCta.textContent = '¡Llévame a ' + selDept.value.charAt(0).toUpperCase() + selDept.value.slice(1) + '!';
        } else {
          btnCta.textContent = '¡Recomiéndame una aventura!';
        }
      });
    }

    // CTA — animación de dado + redirección
    if (btnCta) {
      btnCta.addEventListener('click', function () {
        // Departamento es opcional: si está vacío usa todo Colombia
        var dept = selDept ? selDept.value : '';
        var pool = dept
          ? RUTAS.filter(function (r) { return r.dept === dept; })
          : RUTAS;
        if (pool.length === 0) pool = RUTAS;

        // Animación: cuenta regresiva tipo "tirando el dado"
        var frames = ['🎲', '🎲 ...', '🎲 ......'];
        var i = 0;
        btnCta.disabled = true;
        btnCta.style.opacity = '0.8';
        var interval = setInterval(function () {
          btnCta.textContent = frames[i % frames.length];
          i++;
        }, 180);

        setTimeout(function () {
          clearInterval(interval);
          var pick = weightedShuffle(pool)[0];
          closeModal();
          window.location.href = pick.url;
        }, 900);
      });
    }
  }

  // ─── CTA BUTTON ──────────────────────────────────────────────────────────
  // El CTA ahora es manejado por adventure-form.html
  function initCta() {
    // No-op: el formulario de adventure-form.html maneja el click
  }

  // ─── INIT ─────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    loadRutas(function() {
      renderFeatured();
      initSearch();
      initDadoModal();
      initCta();
    });
  });
})();
