(function () {
  var slider = document.querySelector('[data-hero-slider]');
  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
    var index = 0;
    var showSlide = function (nextIndex) {
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
    };
    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        showSlide(dotIndex);
      });
    });
    showSlide(0);
    window.setInterval(function () {
      showSlide(index + 1);
    }, 5200);
  }

  var toggle = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('img[data-cover]').forEach(function (img) {
    img.addEventListener('error', function () {
      img.classList.add('is-missing');
    });
  });

  var params = new URLSearchParams(window.location.search);
  var queryFromUrl = params.get('q') || '';
  var searchInput = document.querySelector('[data-search]');
  if (searchInput && queryFromUrl) {
    searchInput.value = queryFromUrl;
  }

  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
  var emptyState = document.querySelector('[data-empty-state]');
  var filterInputs = Array.prototype.slice.call(document.querySelectorAll('[data-search], [data-filter]'));
  var chipButtons = Array.prototype.slice.call(document.querySelectorAll('[data-chip]'));

  var normalize = function (value) {
    return String(value || '').trim().toLowerCase();
  };

  var applyFilters = function () {
    if (!cards.length) {
      return;
    }
    var text = normalize(searchInput ? searchInput.value : '');
    var activeFilters = {};
    document.querySelectorAll('[data-filter]').forEach(function (field) {
      activeFilters[field.getAttribute('data-filter')] = normalize(field.value);
    });
    var visible = 0;
    cards.forEach(function (card) {
      var haystack = normalize(card.getAttribute('data-tags'));
      var isMatch = !text || haystack.indexOf(text) !== -1;
      Object.keys(activeFilters).forEach(function (key) {
        var value = activeFilters[key];
        if (value && normalize(card.getAttribute('data-' + key)) !== value) {
          isMatch = false;
        }
      });
      card.style.display = isMatch ? '' : 'none';
      if (isMatch) {
        visible += 1;
      }
    });
    if (emptyState) {
      emptyState.classList.toggle('is-visible', visible === 0);
    }
  };

  filterInputs.forEach(function (field) {
    field.addEventListener('input', applyFilters);
    field.addEventListener('change', applyFilters);
  });
  chipButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      if (searchInput) {
        searchInput.value = button.getAttribute('data-chip') || '';
      }
      applyFilters();
    });
  });
  applyFilters();

  var player = document.querySelector('[data-player]');
  if (player) {
    var video = player.querySelector('video');
    var button = player.querySelector('[data-play-button]');
    var overlay = player.querySelector('[data-player-overlay]');
    var message = document.querySelector('[data-player-message]');
    var hlsInstance = null;
    var sourceIndex = 0;
    var sources = [];

    var primary = video ? video.getAttribute('data-video-src') : '';
    var fallbackRaw = video ? video.getAttribute('data-video-fallbacks') : '';
    if (primary) {
      sources.push(primary);
    }
    if (fallbackRaw) {
      fallbackRaw.split('|').forEach(function (item) {
        if (item && sources.indexOf(item) === -1) {
          sources.push(item);
        }
      });
    }

    var setMessage = function (text) {
      if (message) {
        message.textContent = text || '';
      }
    };

    var loadSource = function (src) {
      if (!video || !src) {
        return;
      }
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        setMessage('播放源已加载，点击播放器可继续控制。');
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hlsInstance.loadSource(src);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
          setMessage('播放源已加载，点击播放器可继续控制。');
        });
        hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal && sourceIndex < sources.length - 1) {
            sourceIndex += 1;
            loadSource(sources[sourceIndex]);
            video.play().catch(function () {});
          }
        });
        return;
      }
      video.src = src;
    };

    var startPlayback = function () {
      if (!video || !sources.length) {
        setMessage('当前浏览器无法加载播放源。');
        return;
      }
      if (!video.getAttribute('src') && !hlsInstance) {
        loadSource(sources[sourceIndex]);
      }
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
      video.play().catch(function () {
        setMessage('播放源已就绪，请再次点击播放器播放。');
      });
    };

    if (button) {
      button.addEventListener('click', startPlayback);
    }
    if (video) {
      video.addEventListener('play', function () {
        if (overlay) {
          overlay.classList.add('is-hidden');
        }
      });
    }
  }
})();
