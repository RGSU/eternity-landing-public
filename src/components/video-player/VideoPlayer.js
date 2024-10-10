import Events from '../../scripts/Events.js';

export default class VideoPlayer {
  constructor(element, options) {
    if (!element) throw new Error('undefined element');
    this.element = element;
    this.options = { ...VideoPlayer.defaults(), ...options };
    this.init();
  }

  static defaults() {
    return {};
  }

  init() {
    this.events = new Events(this);

    this.videoContainer = this.element.querySelector('.video-player__video-container');

    this.video = this.videoContainer.querySelector('video');
    if (this.video) {
      this.video.addEventListener('loadedmetadata', () => {
        this.updateDuration(this.video.duration);
      });

      this.video.addEventListener('play', this.changeBtnPlayState.bind(this));
      this.video.addEventListener('pause', this.changeBtnPlayState.bind(this));
      this.video.addEventListener('ended', this.changeBtnPlayState.bind(this));
    }

    this.btnPlay = this.element.querySelector('.video-player__btn-play');
    if (this.btnPlay) {
      this.btnPlay.addEventListener('click', this.handleBtnPlayClick.bind(this));
    }

    this.btnLikes = this.element.querySelector('.video-player__likes');
    // this.btnLikes.addEventListener('click', this.handleBtnLikesClick.bind(this));

    // this.provider = this.videoContainer.getAttribute('data-provider') || '';
    this.iframe = this.videoContainer.querySelector('iframe');
    if (this.iframe) {
      const videoWidth = this.iframe.getAttribute('width') || 720;
      const videoHeight = this.iframe.getAttribute('height') || 405;
      const aspectRatio = +videoHeight / +videoWidth;
      this.videoContainer.style.paddingBottom = `${(aspectRatio * 100)}%`;
    }
  }

  isHtml5() {
    return (this.video !== undefined && this.video !== null);
  }

  isYoutube() {
    return this.provider.trim() === 'youtube';
  }

  updateDuration(value) {
    const durationEl = this.element.querySelector('.video-player__duration');
    if (durationEl) {
      durationEl.textContent = VideoPlayer.formatSecondsToTime(value);
    }
  }

  static formatSecondsToTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.round(seconds % 60);

    return [hours, minutes, secs]
      .map((v) => (v < 10 ? `0${v}` : v))
      .filter((v, i) => v !== '00' || i > 0)
      .join(':');
  }

  changeBtnPlayState() {
    if (this.video) {
      this.btnPlay.classList.toggle('active', !(this.video.paused || this.video.ended));
    }
  }

  play() {
    if (this.video) {
      this.video.play();
    }
  }

  pause() {
    if (this.video) {
      this.video.pause();
    }
  }

  stop() {
    if (this.video) {
      this.video.pause();
      this.video.currentTime = 0;
      this.video.load();
      this.changeBtnPlayState();
    }
  }

  handleBtnPlayClick() {
    if (this.video) {
      if (this.video.paused || this.video.ended) {
        this.video.play();
      } else {
        this.video.pause();
      }
    }
  }
  // handleBtnLikesClick(event) {
  //   const btnLikes = event.target.closest('.video-player__likes');
  //   if (btnLikes) {
  //     const labelEl = btnLikes.querySelector('.video-player__likes-value');
  //     let count = +labelEl.textContent.trim() || 0;
  //     count += 1;
  //     labelEl.textContent = count;
  //     this.emit('changeLikes', {
  //       detail: {
  //         likes: count,
  //       },
  //     });
  //   }
  // }
}
