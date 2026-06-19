(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobilePanel = document.querySelector('[data-mobile-panel]');

    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function () {
            mobilePanel.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var mainImage = hero.querySelector('[data-hero-image]');
        var mainTitle = hero.querySelector('[data-hero-title]');
        var mainText = hero.querySelector('[data-hero-text]');
        var mainLink = hero.querySelector('[data-hero-link]');
        var mainMeta = hero.querySelector('[data-hero-meta]');
        var picks = hero.querySelectorAll('[data-hero-pick]');

        picks.forEach(function (pick) {
            pick.addEventListener('click', function (event) {
                event.preventDefault();
                picks.forEach(function (item) {
                    item.classList.remove('is-active');
                });
                pick.classList.add('is-active');
                if (mainImage) {
                    mainImage.src = pick.getAttribute('data-cover') || mainImage.src;
                    mainImage.alt = pick.getAttribute('data-title') || mainImage.alt;
                }
                if (mainTitle) {
                    mainTitle.textContent = pick.getAttribute('data-title') || mainTitle.textContent;
                }
                if (mainText) {
                    mainText.textContent = pick.getAttribute('data-text') || mainText.textContent;
                }
                if (mainLink) {
                    mainLink.href = pick.getAttribute('href') || mainLink.href;
                }
                if (mainMeta) {
                    mainMeta.textContent = pick.getAttribute('data-meta') || mainMeta.textContent;
                }
            });
        });
    }

    var filterPanels = document.querySelectorAll('[data-filter-panel]');
    filterPanels.forEach(function (panel) {
        var input = panel.querySelector('[data-filter-input]');
        var region = panel.querySelector('[data-filter-region]');
        var year = panel.querySelector('[data-filter-year]');
        var scope = document.querySelector(panel.getAttribute('data-filter-panel')) || document;
        var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-search-card]'));
        var empty = scope.querySelector('[data-empty-state]');

        function normalize(value) {
            return String(value || '').toLowerCase().trim();
        }

        function applyFilter() {
            var query = normalize(input && input.value);
            var regionValue = normalize(region && region.value);
            var yearValue = normalize(year && year.value);
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-tags'),
                    card.getAttribute('data-category')
                ].join(' '));
                var okQuery = !query || haystack.indexOf(query) !== -1;
                var okRegion = !regionValue || normalize(card.getAttribute('data-region')) === regionValue;
                var okYear = !yearValue || normalize(card.getAttribute('data-year')) === yearValue;
                var show = okQuery && okRegion && okYear;
                card.style.display = show ? '' : 'none';
                if (show) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.style.display = visible ? 'none' : 'block';
            }
        }

        [input, region, year].forEach(function (node) {
            if (node) {
                node.addEventListener('input', applyFilter);
                node.addEventListener('change', applyFilter);
            }
        });

        var params = new URLSearchParams(window.location.search);
        var q = params.get('q');
        if (q && input) {
            input.value = q;
        }
        applyFilter();
    });

    document.querySelectorAll('[data-player]').forEach(function (box) {
        var video = box.querySelector('video');
        var button = box.querySelector('[data-play-button]');
        var stream = video ? video.getAttribute('data-src') : '';
        var loaded = false;
        var hls = null;

        function startVideo() {
            if (!video || !stream) {
                return;
            }

            if (!loaded) {
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = stream;
                    video.addEventListener('loadedmetadata', function () {
                        video.play().catch(function () {});
                    }, { once: true });
                } else if (typeof Hls !== 'undefined' && Hls.isSupported()) {
                    hls = new Hls({ enableWorker: true });
                    hls.loadSource(stream);
                    hls.attachMedia(video);
                    hls.on(Hls.Events.MANIFEST_PARSED, function () {
                        video.play().catch(function () {});
                    });
                } else {
                    video.src = stream;
                    video.play().catch(function () {});
                }
                loaded = true;
            } else {
                video.play().catch(function () {});
            }
            box.classList.add('is-playing');
        }

        if (button) {
            button.addEventListener('click', startVideo);
        }
        if (video) {
            video.addEventListener('click', function () {
                if (video.paused) {
                    startVideo();
                }
            });
        }
        window.addEventListener('beforeunload', function () {
            if (hls) {
                hls.destroy();
            }
        });
    });
})();
