(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    document.querySelectorAll(".player-shell").forEach(function (shell) {
      var video = shell.querySelector("video");
      var cover = shell.querySelector(".player-cover");
      var playButton = shell.querySelector(".player-play");
      if (!video) {
        return;
      }

      var stream = video.getAttribute("data-stream");
      var attached = false;
      var hls;

      var attach = function () {
        if (attached || !stream) {
          return;
        }
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = stream;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(stream);
          hls.attachMedia(video);
        } else {
          video.src = stream;
        }
        attached = true;
      };

      var start = function () {
        attach();
        if (cover) {
          cover.classList.add("is-hidden");
        }
        video.setAttribute("controls", "controls");
        var promise = video.play();
        if (promise && promise.catch) {
          promise.catch(function () {});
        }
      };

      if (cover) {
        cover.addEventListener("click", start);
      }
      if (playButton) {
        playButton.addEventListener("click", function (event) {
          event.preventDefault();
          event.stopPropagation();
          start();
        });
      }
      video.addEventListener("click", function () {
        if (video.paused) {
          start();
        }
      });
      window.addEventListener("beforeunload", function () {
        if (hls) {
          hls.destroy();
        }
      });
    });
  });
})();
