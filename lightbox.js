document.lightbox = (function lightbox () {
  var lightboxData;
  var current = 0;
  var elLightboxInner;
  var KEY_LEFT = 37;
  var KEY_RIGHT = 39;
  var KEY_ESC = 27;

  function init (imageData) {
    lightboxData = document.lightboxData;
    var elWrapModal = document.createElement('div');
    elWrapModal.id = 'lightbox';
    elWrapModal.className = 'lightbox-wrap';

    var elLightbox = document.createElement('div');
    elLightbox.className = 'lightbox';

    elLightboxInner = document.createElement('div');
    elLightboxInner.className = 'lightbox-inner';

    var elLightboxPrev = document.createElement('div');
    elLightboxPrev.className = 'lightbox__prev';
    elLightboxPrev.addEventListener('click', prev);

    var elLightboxNext = document.createElement('div');
    elLightboxNext.className = 'lightbox__next';
    elLightboxNext.addEventListener('click', next);

    var elLightboxClose = document.createElement('div');
    elLightboxClose.id = 'lightbox__close';
    elLightboxClose.className = 'lightbox__close';
    elLightboxClose.innerHTML = '&times;';
    elLightboxClose.addEventListener('click', remove);

    elLightbox.appendChild(elLightboxPrev);
    elLightbox.appendChild(elLightboxNext);
    elLightbox.appendChild(elLightboxClose);
    elLightbox.appendChild(elLightboxInner);
    elWrapModal.appendChild(elLightbox);

    setContent(imageData);
    document.addEventListener('keydown', arrowKeys);

    document.body.appendChild(elWrapModal);
  }

  function setContent (imageData) {
    var elLightboxContent;

    if (isYoutTubeUrl(imageData.url)) {
      elLightboxContent = document.createElement('div');
      elLightboxContent.className = 'lightbox__content lightbox__content--iframe';
      var iframe = document.createElement('iframe');
      iframe.src = imageData.url;
      iframe.className = 'lightbox__iframe';
      elLightboxContent.appendChild(iframe);
    } else {
      elLightboxContent = document.createElement('img');
      elLightboxContent.className = 'lightbox__content';
      elLightboxContent.alt = imageData.title;
      elLightboxContent.src = imageData.url;
    }

    var elLightboxTitle = document.createElement('div');
    elLightboxTitle.className = 'lightbox__title';
    elLightboxTitle.textContent = imageData.title;

    var elLightboxCaption = document.createElement('div');
    elLightboxCaption.className = 'lightbox__caption';
    elLightboxCaption.textContent = imageData.caption;

    var content = document.createElement('div');
    content.appendChild(elLightboxContent);
    content.appendChild(elLightboxTitle);
    content.appendChild(elLightboxCaption);

    elLightboxInner.innerHTML = content.innerHTML;
    current = lightboxData.indexOf(imageData);
    preloadAdjacentImages();
  }

  function remove () {
    document.body.removeChild(document.getElementById('lightbox'));
    document.removeEventListener('keydown', arrowKeys);
  }

  function nextIndex () {
    if (lightboxData.length === 1) {
      return 0; // only one element in array so no next item, return current
    } else if (current > lightboxData.length - 2) {
      return 0; // at end of array, return first item
    } else {
      return current + 1;
    }
  }

  function prevIndex () {
    if (lightboxData.length === 1) {
      return 0; // only one element in array so no next item, return current
    } else if (current === 0) {
      return lightboxData.length - 1; // at start of array, return last item
    } else {
      return current - 1;
    }
  }

  function next () {
    setContent(lightboxData[nextIndex()]);
  }

  function prev () {
    setContent(lightboxData[prevIndex()]);
  }

  function preloadAdjacentImages () {
    // preload next and previous images for smoother transation
    if (isYoutTubeUrl(lightboxData[prevIndex()].url)) {
      var elPrevImage = new window.Image();
      elPrevImage.src = lightboxData[prevIndex()].url;
    }
    if (isYoutTubeUrl(lightboxData[nextIndex()].url)) {
      var elNextImage = new window.Image();
      elNextImage.src = lightboxData[nextIndex()].url;
    }
  }

  function arrowKeys (event) {
    if (event.keyCode === KEY_LEFT) {
      prev();
    } else if (event.keyCode === KEY_RIGHT) {
      next();
    } else if (event.keyCode === KEY_ESC) {
      remove();
    }
  }

  function isYoutTubeUrl (url) {
    return url.indexOf('://www.youtube.com/embed/') > -1;
  }

  return init;
})();