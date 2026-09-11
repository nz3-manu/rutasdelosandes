(function () {
  var sidebar = document.getElementById("sidebar");
  var openButton = document.querySelector("[data-sidebar-open]");
  var closeTargets = document.querySelectorAll("[data-sidebar-close]");
  var mask = document.querySelector(".side-bar__mask");

  function setSidebar(open) {
    if (!sidebar) return;
    sidebar.classList.toggle("is-open", open);
    sidebar.setAttribute("aria-hidden", open ? "false" : "true");
    if (openButton) {
      openButton.setAttribute("aria-expanded", open ? "true" : "false");
    }
    if (mask) {
      mask.hidden = !open;
    }
    document.documentElement.classList.toggle("has-open-sidebar", open);
  }

  if (openButton) {
    openButton.addEventListener("click", function () {
      setSidebar(true);
    });
  }

  closeTargets.forEach(function (target) {
    target.addEventListener("click", function () {
      setSidebar(false);
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      setSidebar(false);
    }
  });

  document.querySelectorAll("[data-native-share]").forEach(function (button) {
    button.addEventListener("click", function () {
      var title = button.getAttribute("data-share-title") || document.title;
      var url = button.getAttribute("data-share-url") || window.location.href;
      if (navigator.share) {
        navigator.share({ title: title, url: url });
      } else {
        navigator.clipboard && navigator.clipboard.writeText(url);
      }
    });
  });

  document.querySelectorAll("[data-carousel]").forEach(function (carousel) {
    var track = carousel.querySelector(".rda-carousel__track");
    var previous = carousel.querySelector("[data-carousel-prev]");
    var next = carousel.querySelector("[data-carousel-next]");
    if (!track) return;

    function scroll(direction) {
      track.scrollBy({
        left: direction * Math.max(track.clientWidth * 0.9, 280),
        behavior: "smooth",
      });
    }

    if (previous) {
      previous.addEventListener("click", function () {
        scroll(-1);
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        scroll(1);
      });
    }
  });
})();


/* ============================================================
   Formulario "Recomiéndanos una aventura" (genérico)
   Funciona para cualquier <form data-recommend> de la página,
   ya sea dentro del modal del home o embebido (inline) en el blog.
   Envía a Google Apps Script vía un iframe oculto (evita CORS).
   ============================================================ */
(function () {
  var APPS_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbzUm15XJ5TEyICnVGSFowSnFT8n5Fxtw8S3KxzQhmaYNouzVhnzHIwSJEYKUf-rIGPG/exec";

  var forms = document.querySelectorAll("form[data-recommend]");
  Array.prototype.forEach.call(forms, function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var submitBtn = form.querySelector('[type="submit"]');
      var success = form.querySelector("[data-recommend-success]");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Enviando...";
      }

      var iframe = document.createElement("iframe");
      iframe.name = "recommend-iframe-" + Math.random().toString(36).slice(2);
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      var hiddenForm = document.createElement("form");
      hiddenForm.method = "POST";
      hiddenForm.action = APPS_SCRIPT_URL;
      hiddenForm.target = iframe.name;

      ["nombre", "whatsapp", "lugar"].forEach(function (field) {
        var src = form.querySelector('[name="' + field + '"]');
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = field;
        input.value = src ? src.value : "";
        hiddenForm.appendChild(input);
      });

      document.body.appendChild(hiddenForm);
      hiddenForm.submit();

      // No podemos leer la respuesta del iframe (CORS): mostramos éxito tras un delay.
      setTimeout(function () {
        form.reset();
        form.style.display = "none";
        if (success) success.style.display = "block";
        document.body.removeChild(hiddenForm);
        document.body.removeChild(iframe);

        // Si el formulario está dentro del modal, cerrarlo después de un momento.
        var modal = form.closest(".adventure-modal");
        if (modal) {
          setTimeout(function () {
            modal.classList.add("hidden");
            modal.setAttribute("aria-hidden", "true");
          }, 2500);
        }
      }, 1500);
    });
  });
})();
