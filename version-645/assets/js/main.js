(function () {
  function ready(callback) {
    if (document.readyState !== 'loading') {
      callback();
      return;
    }
    document.addEventListener('DOMContentLoaded', callback);
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function setupMenu() {
    var button = document.querySelector('[data-menu-toggle]');
    var menu = document.querySelector('[data-mobile-menu]');
    if (!button || !menu) {
      return;
    }
    button.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  function setupHero() {
    var carousel = document.querySelector('[data-hero-carousel]');
    if (!carousel) {
      return;
    }
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var prev = carousel.querySelector('[data-hero-prev]');
    var next = carousel.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        show(dotIndex);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        restart();
      });
    }

    show(0);
    restart();
  }

  function setupFilters() {
    var areas = Array.prototype.slice.call(document.querySelectorAll('[data-card-area]'));
    if (!areas.length) {
      return;
    }
    var keyword = document.querySelector('[data-search-input]');
    var year = document.querySelector('[data-filter-year]');
    var type = document.querySelector('[data-filter-type]');
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');

    if (keyword && q) {
      keyword.value = q;
    }

    function cardText(card) {
      return normalize([
        card.dataset.title,
        card.dataset.year,
        card.dataset.region,
        card.dataset.type,
        card.dataset.genre,
        card.textContent
      ].join(' '));
    }

    function apply() {
      var query = normalize(keyword ? keyword.value : '');
      var selectedYear = year ? year.value : '';
      var selectedType = type ? type.value : '';

      areas.forEach(function (area) {
        var cards = Array.prototype.slice.call(area.querySelectorAll('[data-card]'));
        var visible = 0;
        cards.forEach(function (card) {
          var matchesQuery = !query || cardText(card).indexOf(query) !== -1;
          var matchesYear = !selectedYear || card.dataset.year === selectedYear;
          var matchesType = !selectedType || card.dataset.type === selectedType;
          var ok = matchesQuery && matchesYear && matchesType;
          card.style.display = ok ? '' : 'none';
          if (ok) {
            visible += 1;
          }
        });
        var empty = area.parentElement ? area.parentElement.querySelector('[data-empty-state]') : null;
        if (empty) {
          empty.classList.toggle('is-visible', visible === 0);
        }
      });
    }

    [keyword, year, type].forEach(function (field) {
      if (field) {
        field.addEventListener('input', apply);
        field.addEventListener('change', apply);
      }
    });

    apply();
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupFilters();
  });
})();
