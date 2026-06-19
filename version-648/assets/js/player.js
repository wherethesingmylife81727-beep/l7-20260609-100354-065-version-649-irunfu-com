(function () {
  var hlsLoader = null;

  function getHls() {
    if (window.Hls) {
      return Promise.resolve(window.Hls);
    }
    if (!hlsLoader) {
      hlsLoader = import("./hls.js").then(function (module) {
        return module.H || module.default || null;
      }).catch(function () {
        return null;
      });
    }
    return hlsLoader;
  }

  function safePlay(video) {
    var result = video.play();
    if (result && typeof result.catch === "function") {
      result.catch(function () {});
    }
  }

  window.initMoviePlayer = function (config) {
    var video = document.getElementById(config.video);
    var trigger = document.getElementById(config.trigger);
    var source = config.source;
    if (!video || !trigger || !source) {
      return;
    }
    var started = false;
    function reveal() {
      trigger.classList.add("is-hidden");
      video.controls = true;
    }
    function bindWithHls(Hls) {
      if (Hls && Hls.isSupported && Hls.isSupported()) {
        var player = new Hls({
          maxBufferLength: 30,
          backBufferLength: 30
        });
        player.loadSource(source);
        player.attachMedia(video);
        video._hlsPlayer = player;
      } else {
        video.src = source;
      }
      video.load();
      safePlay(video);
    }
    function start() {
      reveal();
      if (started) {
        safePlay(video);
        return;
      }
      started = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
        video.load();
        safePlay(video);
        return;
      }
      getHls().then(bindWithHls);
    }
    trigger.addEventListener("click", start);
    video.addEventListener("click", function () {
      if (video.paused) {
        start();
      }
    });
  };
}());
