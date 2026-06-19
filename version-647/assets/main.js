(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function initMobileNav() {
    var toggle = document.querySelector("[data-mobile-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener("click", function () {
      panel.classList.toggle("is-open");
      toggle.textContent = panel.classList.contains("is-open") ? "×" : "☰";
    });
  }

  function initHero() {
    var carousel = document.querySelector("[data-hero-carousel]");
    if (!carousel) {
      return;
    }
    var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
    if (slides.length < 2) {
      return;
    }
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    function start() {
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        window.clearInterval(timer);
        show(dotIndex);
        start();
      });
    });

    start();
  }

  function initLocalFilters() {
    var panel = document.querySelector("[data-filter-form]");
    if (!panel) {
      return;
    }
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
    var keyword = panel.querySelector("[data-filter-keyword]");
    var region = panel.querySelector("[data-filter-region]");
    var type = panel.querySelector("[data-filter-type]");
    var year = panel.querySelector("[data-filter-year]");
    var reset = panel.querySelector("[data-filter-reset]");

    function cardText(card) {
      return [
        card.getAttribute("data-title"),
        card.getAttribute("data-region"),
        card.getAttribute("data-type"),
        card.getAttribute("data-year"),
        card.getAttribute("data-genre"),
        card.getAttribute("data-tags")
      ].join(" ").toLowerCase();
    }

    function apply() {
      var q = keyword ? keyword.value.trim().toLowerCase() : "";
      var r = region ? region.value : "";
      var t = type ? type.value : "";
      var y = year ? year.value : "";
      cards.forEach(function (card) {
        var matched = true;
        if (q && cardText(card).indexOf(q) === -1) {
          matched = false;
        }
        if (r && card.getAttribute("data-region") !== r) {
          matched = false;
        }
        if (t && card.getAttribute("data-type") !== t) {
          matched = false;
        }
        if (y && card.getAttribute("data-year") !== y) {
          matched = false;
        }
        card.classList.toggle("is-hidden-card", !matched);
      });
    }

    [keyword, region, type, year].forEach(function (control) {
      if (control) {
        control.addEventListener("input", apply);
        control.addEventListener("change", apply);
      }
    });

    if (reset) {
      reset.addEventListener("click", function () {
        if (keyword) keyword.value = "";
        if (region) region.value = "";
        if (type) type.value = "";
        if (year) year.value = "";
        apply();
      });
    }
  }

  function renderSearchCard(movie) {
    return [
      '<a class="movie-card" href="' + escapeHtml(movie.href) + '">',
      '  <div class="thumb-wrap">',
      '    <img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '    <span class="duration">' + escapeHtml(movie.duration) + '</span>',
      '  </div>',
      '  <div class="card-body">',
      '    <h2>' + escapeHtml(movie.title) + '</h2>',
      '    <p>' + escapeHtml(movie.oneLine) + '</p>',
      '    <div class="card-tags"><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.type) + '</span><span>' + escapeHtml(movie.year) + '</span></div>',
      '    <div class="card-meta"><span>★ ' + escapeHtml(movie.rating) + '</span><span>' + escapeHtml(movie.category) + '</span></div>',
      '  </div>',
      '</a>'
    ].join("");
  }

  function initSearchPage() {
    var page = document.getElementById("search-page");
    var results = document.getElementById("search-results");
    if (!page || !results || !window.SEARCH_INDEX) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || "";
    var input = page.querySelector("[data-search-input]");
    if (input) {
      input.value = query;
    }

    function normalized(value) {
      return String(value || "").toLowerCase();
    }

    function render(value) {
      var q = normalized(value).trim();
      var items = window.SEARCH_INDEX.filter(function (movie) {
        if (!q) {
          return true;
        }
        return normalized([
          movie.title,
          movie.oneLine,
          movie.region,
          movie.type,
          movie.year,
          movie.genre,
          movie.tags,
          movie.category
        ].join(" ")).indexOf(q) !== -1;
      }).slice(0, 120);
      results.innerHTML = items.map(renderSearchCard).join("");
    }

    if (input) {
      input.addEventListener("input", function () {
        render(input.value);
      });
    }
    render(query);
  }

  ready(function () {
    initMobileNav();
    initHero();
    initLocalFilters();
    initSearchPage();
  });
})();
