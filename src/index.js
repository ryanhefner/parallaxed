/**
 * Parallaxed
 *
 * @author Ryan Hefner <hi@ryanhefner.com> (https://www.ryanhefner.com)
 */
class Parallaxed {
  constructor({selectors, onEnter = () => {}, onExit = () => {}, onProgress = () => {}}) {
    this.scrollingElement = document.scrollingElement || document.body;
    this.selectors = selectors;
    this._onEnter = onEnter;
    this._onExit = onExit;
    this._onProgress = onProgress;

    this._onDOMChange = this._onDOMChange.bind(this);
    this._onScroll = this._onScroll.bind(this);
    this._onResize = this._onResize.bind(this);

    window.addEventListener('scroll', this._onScroll);
    window.addEventListener('resize', this._onResize);

    this._observer = new MutationObserver(this._onDOMChange);
    this._observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    this._checkElements();
  }

  set scrollingElement(value) {
    this._scrollingElement = value;
  }

  get scrollingElement() {
    return this._scrollingElement;
  }

  set selectors(value) {
    this._selectors = value;
    this._refreshActiveElements();
  }

  get selectors() {
    return this._selectors;
  }

  destroy() {
    window.removeEventListener('scroll', this._onScroll);
    window.removeEventListener('resize', this._onResize);
    this._observer.disconnect();
  }

  _refreshActiveElements() {
    let elements = [];

    if (Array.isArray(this._selectors)) {
      this._selectors.forEach(selector => {
        elements = [
          ...elements,
          ...[].slice.call(document.querySelectorAll(selector)),
        ];
      });
    }
    else {
      elements = [
        ...elements,
        ...[].slice.call(document.querySelectorAll(this._selectors)),
      ];
    }

    this.activeElements = elements.map(element => {
      return {
        element,
        inViewport: false,
        progress: 0,
      };
    });
  }

  _checkElements() {
    this.activeElements.forEach((element, index, array) => {
      const htmlElement = element.element;
      const rect = htmlElement.getBoundingClientRect();
      const viewportStart = 0;
      const viewportEnd = window.innerHeight;
      const inViewport = rect.top <= viewportEnd && rect.bottom >= viewportStart;
      const progress = Math.max(0, Math.min(1, 1 - (rect.bottom / (viewportEnd + rect.height))));

      if (element.inViewport !== inViewport) {
        const enterExitCallback = inViewport ? this._onEnter : this._onExit;
        enterExitCallback({
          element: htmlElement,
          inViewport,
          progress,
        });
      }

      if (inViewport) {
        this._onProgress({
          element: htmlElement,
          inViewport,
          progress,
        });
      }

      array[index] = {
        element: htmlElement,
        inViewport,
        progress,
      };
    });
  }

  _onDOMChange(evt) {
    this._refreshActiveElements();
    this._checkElements();
  }

  _onScroll(evt) {
    this._checkElements();
  }

  _onResize(evt) {
    this._checkElements();
  }
}

export default Parallaxed;
