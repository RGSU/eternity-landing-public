import VideoPlayer from './VideoPlayer.js';

const initVideoPlayer = (element) => {
  element.videoPlayer = new VideoPlayer(element);
};

window.initVideoPlayer = initVideoPlayer;

document.querySelectorAll('.video-player').forEach((el) => initVideoPlayer(el));
