import scrollto from '../utils/scrollto.js';

const autoscroll = () => {
  const duration = 500;
  const offset = 60;

  function isCssSmoothScrollSupported() {
    return 'scrollBehavior' in document.documentElement.style;
  }

  if (isCssSmoothScrollSupported()) return;

  const stripHash = (url) => url.slice(0, url.lastIndexOf('#'));

  const pageUrl = window.location.hash ? stripHash(window.location.href) : window.location.href;

  const isInPageLink = (n) => n.tagName.toLowerCase() === 'a' && n.hash.length > 0 && stripHash(n.href) === pageUrl;

  // Adapted from:
  // https://www.nczonline.net/blog/2013/01/15/fixing-skip-to-content-links/
  const setFocus = (hash) => {
    const element = document.getElementById(hash.substring(1));

    if (element) {
      if (!/^(?:a|select|input|button|textarea)$/i.test(element.tagName)) {
        element.tabIndex = -1;
      }
      element.focus();
    }
  };

  const delegatedLinkHijacking = () => {
    const onClick = (e) => {
      if (!isInPageLink(e.target)) return;

      e.stopPropagation();
      e.preventDefault();

      scrollto(e.target.hash, {
        duration,
        offset,
        callback() {
          setFocus(e.target.hash);
        },
      });
    };

    document.body.addEventListener('click', onClick, false);
  };

  // eslint-disable-next-line no-unused-vars
  const directLinkHijacking = () => {
    function onClick(e) {
      e.stopPropagation();
      e.preventDefault();

      scrollto(e.target.hash, {
        duration,
        offset,
      });
    }

    [].slice.call(document.querySelectorAll('a')).filter(isInPageLink).forEach((a) => {
      a.addEventListener('click', onClick, false);
    });
  };

  delegatedLinkHijacking();
  // directLinkHijacking();
};

autoscroll();
