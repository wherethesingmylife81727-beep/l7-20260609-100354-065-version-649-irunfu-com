import { H as Hls } from './hls-dru42stk.js';

function getUrl(video) {
  var source = video.querySelector('source');
  return source ? source.getAttribute('src') : video.getAttribute('src');
}

function bind(video, url) {
  if (video.dataset.ready === 'true') {
    return;
  }

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url;
  } else if (Hls.isSupported()) {
    var hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true
    });
    hls.loadSource(url);
    hls.attachMedia(video);
    video._hls = hls;
  } else {
    video.src = url;
  }

  video.dataset.ready = 'true';
}

function start(player) {
  var video = player.querySelector('video');
  if (!video) {
    return;
  }

  var url = getUrl(video);
  if (!url) {
    return;
  }

  bind(video, url);
  video.controls = true;
  player.classList.add('is-playing');

  var result = video.play();
  if (result && typeof result.catch === 'function') {
    result.catch(function () {});
  }
}

Array.prototype.slice.call(document.querySelectorAll('.js-player')).forEach(function (player) {
  var button = player.querySelector('.player-start');
  var video = player.querySelector('video');

  if (button) {
    button.addEventListener('click', function () {
      start(player);
    });
  }

  if (video) {
    video.addEventListener('click', function () {
      if (!player.classList.contains('is-playing')) {
        start(player);
      }
    });
  }
});
