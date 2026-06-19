(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var heroSlider = document.querySelector('[data-hero-slider]');
  if (heroSlider) {
    var slides = Array.prototype.slice.call(heroSlider.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(heroSlider.querySelectorAll('[data-hero-dot]'));
    var prev = heroSlider.querySelector('[data-hero-prev]');
    var next = heroSlider.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
        restart();
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        showSlide(dotIndex);
        restart();
      });
    });

    showSlide(0);
    restart();
  }

  function normalize(value) {
    return String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function applyFilter(input, list) {
    var query = normalize(input.value);
    var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));
    cards.forEach(function (card) {
      var haystack = normalize(card.getAttribute('data-search'));
      card.classList.toggle('is-hidden', query && haystack.indexOf(query) === -1);
    });
  }

  var filterInputs = Array.prototype.slice.call(document.querySelectorAll('.js-filter-input'));
  filterInputs.forEach(function (input) {
    var list = document.querySelector('.js-filter-list');
    if (!list) {
      return;
    }
    input.addEventListener('input', function () {
      applyFilter(input, list);
    });
  });

  var searchPage = document.querySelector('[data-search-page]');
  if (searchPage) {
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    var input = searchPage.querySelector('.js-search-page-input');
    var list = searchPage.querySelector('.js-search-results');
    if (input && list) {
      input.value = query;
      applyFilter(input, list);
      input.addEventListener('input', function () {
        applyFilter(input, list);
      });
    }
  }
})();
