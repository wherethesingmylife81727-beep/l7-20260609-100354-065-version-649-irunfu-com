import { H as Hls } from './hls.js';

function setStatus(player, message) {
  var status = player.querySelector('[data-player-status]');
  if (status) {
    status.textContent = message;
  }
}

function initializePlayer(player) {
  var button = player.querySelector('[data-play-button]');
  var video = player.querySelector('video');
  var source = player.getAttribute('data-video-url');
  var hlsInstance = null;

  if (!button || !video || !source) {
    setStatus(player, '未找到可播放线路。');
    return;
  }

  button.addEventListener('click', function () {
    button.classList.add('is-hidden');
    video.controls = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      setStatus(player, '正在使用浏览器原生 HLS 播放能力。');
    } else if (Hls && Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
        setStatus(player, 'HLS 线路已加载，正在播放。');
      });
      hlsInstance.on(Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal) {
          setStatus(player, '播放线路加载失败，请稍后重试或更换浏览器。');
          if (hlsInstance) {
            hlsInstance.destroy();
            hlsInstance = null;
          }
        }
      });
    } else {
      video.src = source;
      setStatus(player, '当前浏览器不支持 HLS.js，已尝试直接加载播放地址。');
    }

    video.play().catch(function () {
      setStatus(player, '播放已准备就绪，请再次点击视频播放。');
    });
  });
}

document.querySelectorAll('[data-player]').forEach(initializePlayer);
