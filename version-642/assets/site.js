(function () {
  var mobileToggle = document.querySelector('[data-menu-toggle]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');

  if (mobileToggle && mobilePanel) {
    mobileToggle.addEventListener('click', function () {
      mobilePanel.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('[data-search-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      var input = form.querySelector('input[name="q"]');
      if (!input || !input.value.trim()) {
        event.preventDefault();
        window.location.href = form.getAttribute('action') || 'search.html';
      }
    });
  });

  document.querySelectorAll('.cover-img').forEach(function (image) {
    image.addEventListener('error', function () {
      var frame = image.closest('.poster-frame, .category-overview-art');
      if (frame) {
        frame.classList.add('poster-missing');
      }
      image.style.display = 'none';
    });
  });

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var prev = document.querySelector('[data-hero-prev]');
  var next = document.querySelector('[data-hero-next]');
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

  function restartHeroTimer() {
    if (!slides.length) {
      return;
    }
    window.clearInterval(timer);
    timer = window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  if (slides.length) {
    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
        restartHeroTimer();
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
        restartHeroTimer();
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        restartHeroTimer();
      });
    });
    showSlide(0);
    restartHeroTimer();
  }

  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
  var searchInput = document.getElementById('searchInput');
  var typeFilter = document.getElementById('typeFilter');
  var regionFilter = document.getElementById('regionFilter');
  var yearFilter = document.getElementById('yearFilter');
  var countOutput = document.querySelector('[data-filter-count]');
  var params = new URLSearchParams(window.location.search);
  var initialQuery = params.get('q');

  if (searchInput && initialQuery) {
    searchInput.value = initialQuery;
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function applyFilters() {
    if (!cards.length || !searchInput) {
      return;
    }

    var query = normalize(searchInput.value);
    var typeValue = normalize(typeFilter && typeFilter.value);
    var regionValue = normalize(regionFilter && regionFilter.value);
    var yearValue = normalize(yearFilter && yearFilter.value);
    var visibleCount = 0;

    cards.forEach(function (card) {
      var haystack = normalize(card.getAttribute('data-search'));
      var type = normalize(card.getAttribute('data-type'));
      var region = normalize(card.getAttribute('data-region'));
      var year = normalize(card.getAttribute('data-year'));
      var matches = true;

      if (query && haystack.indexOf(query) === -1) {
        matches = false;
      }
      if (typeValue && type.indexOf(typeValue) === -1) {
        matches = false;
      }
      if (regionValue && region.indexOf(regionValue) === -1) {
        matches = false;
      }
      if (yearValue && year.indexOf(yearValue) === -1) {
        matches = false;
      }

      card.classList.toggle('is-hidden-by-filter', !matches);
      if (matches) {
        visibleCount += 1;
      }
    });

    if (countOutput) {
      countOutput.textContent = '当前显示 ' + visibleCount + ' / ' + cards.length + ' 部影片';
    }
  }

  [searchInput, typeFilter, regionFilter, yearFilter].forEach(function (control) {
    if (control) {
      control.addEventListener('input', applyFilters);
      control.addEventListener('change', applyFilters);
    }
  });

  applyFilters();
})();
