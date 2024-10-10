import VideoThumbnail from './VideoThumbnail.js';

document.querySelectorAll('.video-thumbnail').forEach((el) => {
  el.videoThumbnail = new VideoThumbnail(el);
});
