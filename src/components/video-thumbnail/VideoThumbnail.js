export default class VideoThumbnail {
  constructor(element) {
    if (!element) throw new Error('undefined element');
    this.element = element;
    if (!this.isInitialized()) this.init();
  }

  isInitialized() {
    this.element.classList.contains('is-initialized');
  }

  init() {
    this.provider = this.element.getAttribute('data-provider') || '';
    this.videoId = this.element.getAttribute('data-video-id') || '';
    this.preview = this.element.querySelector('.video-thumbnail__preview');
    this.element.addEventListener('mouseenter', () => this.addVideoPreview());
    this.element.addEventListener('mouseleave', () => this.removeVideoPreview());
    this.element.classList.add('is-initialized');
  }

  addVideoPreview() {
    if (this.provider === 'rutube') {
      let videoPreview = this.preview ? this.preview.querySelector('.video-thumbnail__preview-video') : '';
      if (!videoPreview && this.videoId) {
        videoPreview = document.createElement('img');
        videoPreview.classList.add('video-thumbnail__preview-video');
        videoPreview.setAttribute('alt', '');
        videoPreview.src = `https://rutube.ru/api/video/preview/${this.videoId}/`;
        this.preview.append(videoPreview);
      }
    }
  }

  removeVideoPreview() {
    const videoPreview = this.preview ? this.preview.querySelector('.video-thumbnail__preview-video') : '';
    if (videoPreview) {
      videoPreview.remove();
    }
  }
}
