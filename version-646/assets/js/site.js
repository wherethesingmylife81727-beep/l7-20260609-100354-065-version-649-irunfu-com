(function () {
  const body = document.body;
  const menuButton = document.querySelector('[data-menu-toggle]');
  const navPanel = document.querySelector('[data-nav-panel]');

  if (menuButton && navPanel) {
    menuButton.addEventListener('click', function () {
      navPanel.classList.toggle('is-open');
      body.classList.toggle('is-menu-open');
    });
  }

  const searchInputs = document.querySelectorAll('.site-search');
  searchInputs.forEach(function (input) {
    const panel = input.parentElement.querySelector('[data-search-panel]');
    const movies = Array.isArray(window.SEARCH_MOVIES) ? window.SEARCH_MOVIES : [];

    function closePanel() {
      if (panel) {
        panel.classList.remove('is-open');
      }
    }

    function escapeHtml(value) {
      return String(value).replace(/[&<>"']/g, function (char) {
        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        }[char];
      });
    }

    function renderResults(query) {
      if (!panel) {
        return;
      }
      const keyword = query.trim().toLowerCase();
      if (!keyword) {
        panel.innerHTML = '';
        closePanel();
        return;
      }
      const results = movies.filter(function (movie) {
        return movie.search.includes(keyword);
      }).slice(0, 12);
      if (!results.length) {
        panel.innerHTML = '<div class="search-empty">没有找到匹配内容</div>';
        panel.classList.add('is-open');
        return;
      }
      panel.innerHTML = results.map(function (movie) {
        const title = escapeHtml(movie.title);
        const meta = escapeHtml(movie.meta);
        const file = encodeURI(movie.file);
        const cover = encodeURI(movie.cover);
        return '<a class="search-result" href="./' + file + '">' +
          '<img src="' + cover + '" alt="' + title + '">' +
          '<span><strong>' + title + '</strong><span>' + meta + '</span></span>' +
          '</a>';
      }).join('');
      panel.classList.add('is-open');
    }

    input.addEventListener('input', function () {
      renderResults(input.value);
    });

    input.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        const first = panel ? panel.querySelector('a') : null;
        if (first) {
          window.location.href = first.getAttribute('href');
        }
      }
      if (event.key === 'Escape') {
        input.value = '';
        closePanel();
      }
    });

    document.addEventListener('click', function (event) {
      if (!input.parentElement.contains(event.target)) {
        closePanel();
      }
    });
  });

  const hero = document.querySelector('[data-hero]');
  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    const prev = hero.querySelector('[data-hero-prev]');
    const next = hero.querySelector('[data-hero-next]');
    let activeIndex = 0;
    let timer = null;

    function showSlide(index) {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, itemIndex) {
        slide.classList.toggle('is-active', itemIndex === activeIndex);
      });
      dots.forEach(function (dot, itemIndex) {
        dot.classList.toggle('is-active', itemIndex === activeIndex);
      });
    }

    function startTimer() {
      clearInterval(timer);
      timer = setInterval(function () {
        showSlide(activeIndex + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(activeIndex - 1);
        startTimer();
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        showSlide(activeIndex + 1);
        startTimer();
      });
    }
    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
        startTimer();
      });
    });
    if (slides.length > 1) {
      startTimer();
    }
  }

  document.querySelectorAll('[data-filter-bar]').forEach(function (bar) {
    const list = bar.parentElement.querySelector('[data-filter-list]');
    if (!list) {
      return;
    }
    const items = Array.from(list.querySelectorAll('.movie-filter-item'));
    bar.addEventListener('click', function (event) {
      const button = event.target.closest('[data-filter]');
      if (!button) {
        return;
      }
      const value = button.getAttribute('data-filter');
      bar.querySelectorAll('[data-filter]').forEach(function (item) {
        item.classList.toggle('is-active', item === button);
      });
      items.forEach(function (item) {
        const text = [
          item.getAttribute('data-region'),
          item.getAttribute('data-type'),
          item.getAttribute('data-keywords')
        ].join(' ');
        item.classList.toggle('is-hidden', value !== 'all' && !text.includes(value));
      });
    });
  });
})();
