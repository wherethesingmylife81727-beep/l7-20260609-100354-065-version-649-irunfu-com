(function () {
  function ready(callback) {
    if (document.readyState !== 'loading') {
      callback();
      return;
    }
    document.addEventListener('DOMContentLoaded', callback);
  }

  function attach(video, stream) {
    if (video.dataset.ready === '1') {
      return;
    }
    video.dataset.ready = '1';
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(stream);
      hls.attachMedia(video);
      video._hls = hls;
      return;
    }
    video.src = stream;
  }

  function setupPlayer(wrapper) {
    var video = wrapper.querySelector('video[data-stream]');
    var button = wrapper.querySelector('[data-play-button]');
    if (!video || !button) {
      return;
    }
    function start() {
      attach(video, video.dataset.stream);
      button.classList.add('is-hidden');
      var action = video.play();
      if (action && typeof action.catch === 'function') {
        action.catch(function () {});
      }
    }
    button.addEventListener('click', start);
    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });
    video.addEventListener('play', function () {
      button.classList.add('is-hidden');
    });
  }

  ready(function () {
    Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(setupPlayer);
  });
})();
