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
