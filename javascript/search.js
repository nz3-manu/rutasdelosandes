(function () {
  'use strict';

  // ─── NORMALIZACIÓN ───────────────────────────────────────────────────────
  // Elimina tildes, convierte a minúsculas y quita caracteres especiales.
  // "Nevado del Cocuy" → "nevado del cocuy"
  // "Páramos"          → "paramos"
  function normalize(str) {
    if (!str) return '';
    return str
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // elimina diacríticos
      .replace(/[^a-z0-9\s]/g, ' ')   // reemplaza especiales por espacio
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Coincidencia parcial: todos los tokens del query deben aparecer en el texto
  function matches(text, query) {
    var n = normalize(text);
    var tokens = normalize(query).split(' ').filter(Boolean);
    return tokens.every(function (t) { return n.indexOf(t) !== -1; });
  }

  // Resalta el término buscado en el título (HTML)
  function highlight(text, query) {
    if (!query) return text;
    var tokens = normalize(query).split(' ').filter(Boolean);
    var result = text;
    tokens.forEach(function (token) {
      var re = new RegExp('(' + token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
      result = result.replace(re, '<mark style="background:#fff3cd;padding:0 2px;border-radius:2px;">$1</mark>');
    });
    return result;
  }

  // ─── RENDER DE CARDS ─────────────────────────────────────────────────────
  // Usa las mismas clases CSS que el grid de la home (.articles / .article / etc.)
  function renderCard(ruta, query) {
    var titleHtml = highlight(ruta.title, query);
    var img = ruta.images_url
      ? '<img width="581" height="304" src="' + ruta.images_url + '/featured.jpg" alt="' + (ruta.title || '').replace(/"/g, '') + '" loading="lazy" decoding="async">'
      : '';
    return '<li class="article-link">' +
      '<a class="block" href="' + ruta.url + '">' +
        '<div class="article">' +
          '<div class="scrim-top"></div>' +
          '<div class="scrim-bottom"></div>' +
          '<h3 class="article-title">' + titleHtml + '</h3>' +
          img +
        '</div>' +
      '</a>' +
    '</li>';
  }

  // ─── FILTRO ───────────────────────────────────────────────────────────────
  function filterRutas(data, query) {
    if (!query) return data;
    return data.filter(function (r) {
      return matches(r.title, query) ||
             matches(r.departamento, query) ||
             matches(r.categories, query) ||
             matches(r.tags || '', query) ||
             matches(r.excerpt, query);
    });
  }

  // ─── AUTOCOMPLETADO ──────────────────────────────────────────────────────
  function buildAutocomplete(input, list, data) {
    var currentFocus = -1;

    input.addEventListener('input', function () {
      var val = input.value.trim();
      list.innerHTML = '';
      list.style.display = 'none';
      currentFocus = -1;
      if (val.length < 2) return;

      var matches2 = data.filter(function (r) {
        return matches(r.title, val);
      }).slice(0, 6);

      if (matches2.length === 0) return;

      matches2.forEach(function (r, i) {
        var li = document.createElement('li');
        li.setAttribute('role', 'option');
        li.style.cssText = 'padding:10px 14px;cursor:pointer;font-size:14px;color:#111;border-bottom:1px solid #f4f4f5;';
        li.innerHTML = highlight(r.title, val);
        li.addEventListener('mousedown', function (e) {
          e.preventDefault();
          input.value = r.title;
          list.innerHTML = '';
          list.style.display = 'none';
          doSearch(r.title, data);
        });
        li.addEventListener('mouseover', function () {
          removeFocus(list);
          currentFocus = i;
          li.style.background = '#f4f4f5';
        });
        li.addEventListener('mouseout', function () {
          li.style.background = '';
        });
        list.appendChild(li);
      });
      list.style.display = 'block';
    });

    // Navegación teclado
    input.addEventListener('keydown', function (e) {
      var items = list.querySelectorAll('li');
      if (e.key === 'ArrowDown') {
        currentFocus = Math.min(currentFocus + 1, items.length - 1);
        addFocus(items, currentFocus);
      } else if (e.key === 'ArrowUp') {
        currentFocus = Math.max(currentFocus - 1, 0);
        addFocus(items, currentFocus);
      } else if (e.key === 'Enter' && currentFocus >= 0) {
        e.preventDefault();
        items[currentFocus].dispatchEvent(new MouseEvent('mousedown'));
      } else if (e.key === 'Escape') {
        list.style.display = 'none';
      }
    });

    document.addEventListener('click', function (e) {
      if (e.target !== input) {
        list.style.display = 'none';
      }
    });
  }

  function addFocus(items, idx) {
    removeFocus({ querySelectorAll: function() { return items; } });
    if (items[idx]) items[idx].style.background = '#f4f4f5';
  }

  function removeFocus(list) {
    var items = list.querySelectorAll('li');
    items.forEach(function (i) { i.style.background = ''; });
  }

  // ─── RENDER RESULTADOS ───────────────────────────────────────────────────
  function doSearch(query, data) {
    var grid  = document.getElementById('results-grid');
    var noRes = document.getElementById('no-results');
    var info  = document.getElementById('results-info');
    var input = document.getElementById('results-search-input');
    if (!grid) return;

    if (input && input.value !== query) input.value = query;

    var params = new URLSearchParams(window.location.search);
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    history.replaceState(null, '', '/buscar/' + (params.toString() ? '?' + params.toString() : ''));

    var results = filterRutas(data, query);

    // Si hay exactamente 1 resultado → redirige directo
    if (query && results.length === 1) {
      window.location.href = results[0].url;
      return;
    }

    if (results.length === 0) {
      grid.innerHTML = '';
      noRes.style.display = 'block';
      if (info) info.textContent = '';
      return;
    }

    noRes.style.display = 'none';
    if (info) {
      info.textContent = results.length + ' ruta' + (results.length !== 1 ? 's' : '') +
        (query ? ' para "' + query + '"' : '');
    }

    // Agrupa por departamento
    var groups = {};
    var order  = [];
    results.forEach(function (r) {
      var dept = r.departamento || 'Otras';
      if (!groups[dept]) {
        groups[dept] = [];
        order.push(dept);
      }
      groups[dept].push(r);
    });

    // Ordena departamentos alfabéticamente
    order.sort();

    // Renderiza grupos
    var html = order.map(function (dept) {
      var label = dept.charAt(0).toUpperCase() + dept.slice(1);
      var cards = groups[dept].map(function (r) {
        return renderCard(r, query);
      }).join('');

      return '<li class="dept-group">' +
        '<h2 class="dept-group__title">' + label + '</h2>' +
        '<ul class="dept-group__grid">' + cards + '</ul>' +
        '</li>';
    }).join('');

    grid.innerHTML = html;
  }

  // ─── INIT ─────────────────────────────────────────────────────────────────
  function init() {
    var form  = document.getElementById('results-search-form');
    var input = document.getElementById('results-search-input');
    var list  = document.getElementById('autocomplete-list');
    if (!form || !input) return;

    fetch('/search.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {

        buildAutocomplete(input, list, data);

        form.addEventListener('submit', function (e) {
          e.preventDefault();
          list.style.display = 'none';
          var q = input.value.trim();
          if (!q) return;

          var results = filterRutas(data, q);

          // Redirect directo solo si 1 resultado con título exacto
          if (results.length === 1 && normalize(results[0].title) === normalize(q)) {
            window.location.href = results[0].url;
            return;
          }

          // Múltiples o parcial → mostrar grid
          doSearch(q, data);
        });

        // Lee ?q= de la URL al cargar
        var params = new URLSearchParams(window.location.search);
        var q = params.get('q') || '';
        doSearch(q, data);
      })
      .catch(function (err) {
        console.error('Error cargando search.json:', err);
      });
  }

  // Funciona con o sin defer
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
