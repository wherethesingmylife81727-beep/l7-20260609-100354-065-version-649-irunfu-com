(function () {
  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function setupNav() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var nav = document.querySelector("[data-main-nav]");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function setupHero() {
    var root = document.querySelector("[data-hero]");
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
    if (!slides.length) {
      return;
    }
    var index = 0;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
      });
    });
    window.setInterval(function () {
      show(index + 1);
    }, 5200);
  }

  function setupFilters() {
    var panel = document.querySelector("[data-filter-panel]");
    if (!panel) {
      return;
    }
    var search = document.querySelector("[data-filter-search]");
    var submit = document.querySelector("[data-filter-submit]");
    var type = document.querySelector("[data-filter-type]");
    var year = document.querySelector("[data-filter-year]");
    var region = document.querySelector("[data-filter-region]");
    var empty = document.querySelector("[data-filter-empty]");
    var items = Array.prototype.slice.call(document.querySelectorAll("[data-filter-item]"));
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q");
    if (query && search) {
      search.value = query;
    }
    function textOf(item) {
      return normalize([
        item.dataset.title,
        item.dataset.type,
        item.dataset.year,
        item.dataset.region,
        item.dataset.genre,
        item.dataset.tags
      ].join(" "));
    }
    function apply() {
      var q = normalize(search && search.value);
      var t = normalize(type && type.value);
      var y = normalize(year && year.value);
      var r = normalize(region && region.value);
      var visible = 0;
      items.forEach(function (item) {
        var text = textOf(item);
        var ok = true;
        if (q && text.indexOf(q) === -1) {
          ok = false;
        }
        if (t && normalize(item.dataset.type) !== t) {
          ok = false;
        }
        if (y && normalize(item.dataset.year) !== y) {
          ok = false;
        }
        if (r && normalize(item.dataset.region) !== r) {
          ok = false;
        }
        item.hidden = !ok;
        if (ok) {
          visible += 1;
        }
      });
      if (empty) {
        empty.hidden = visible !== 0;
      }
    }
    [search, type, year, region].forEach(function (control) {
      if (control) {
        control.addEventListener("input", apply);
        control.addEventListener("change", apply);
      }
    });
    if (submit) {
      submit.addEventListener("click", apply);
    }
    apply();
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupNav();
    setupHero();
    setupFilters();
  });
}());
