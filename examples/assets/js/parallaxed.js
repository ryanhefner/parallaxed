/*! parallaxed v0.1.0 | (c) 2018 Ryan Hefner | MIT License | https://github.com/ryanhefner/parallaxed !*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.parallaxed = factory());
}(this, (function () { 'use strict';

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  /**
   * Parallaxed
   *
   * @author Ryan Hefner <hi@ryanhefner.com> (https://www.ryanhefner.com)
   */
  var Parallaxed = function () {
    function Parallaxed(_ref) {
      var selectors = _ref.selectors,
          _ref$onEnter = _ref.onEnter,
          onEnter = _ref$onEnter === undefined ? function () {} : _ref$onEnter,
          _ref$onExit = _ref.onExit,
          onExit = _ref$onExit === undefined ? function () {} : _ref$onExit,
          _ref$onProgress = _ref.onProgress,
          onProgress = _ref$onProgress === undefined ? function () {} : _ref$onProgress;
      classCallCheck(this, Parallaxed);

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
      this._observer(document.body, {
        childList: true,
        subtree: true
      });

      this._checkElements();
    }

    Parallaxed.prototype.destroy = function destroy() {
      window.removeEventListener('scroll', this._onScroll);
      window.removeEventListener('resize', this._onResize);
      this._observer.disconnect();
    };

    Parallaxed.prototype._refreshActiveElements = function _refreshActiveElements() {
      var elements = [];

      if (Array.isArray(this._selectors)) {
        this._selectors.forEach(function (selector) {
          elements = [].concat(elements, [].slice.call(document.querySelectorAll(selector)));
        });
      } else {
        elements = [].concat(elements, [].slice.call(document.querySelectorAll(this._selectors)));
      }

      this.activeElements = elements.map(function (element) {
        return {
          element: element,
          inViewport: false,
          progress: 0
        };
      });
    };

    Parallaxed.prototype._checkElements = function _checkElements() {
      var _this = this;

      this.activeElements.forEach(function (element, index, array) {
        var htmlElement = element.element;
        var rect = htmlElement.getBoundingClientRect();
        var viewportStart = 0;
        var viewportEnd = window.innerHeight;
        var inViewport = rect.top <= viewportEnd && rect.bottom >= viewportStart;
        var progress = Math.max(0, Math.min(1, 1 - rect.bottom / (viewportEnd + rect.height)));

        if (element.inViewport !== inViewport) {
          var enterExitCallback = inViewport ? _this._onEnter : _this._onExit;
          enterExitCallback({
            element: htmlElement,
            inViewport: inViewport,
            progress: progress
          });
        }

        if (inViewport) {
          _this._onProgress({
            element: htmlElement,
            inViewport: inViewport,
            progress: progress
          });
        }

        array[index] = {
          element: htmlElement,
          inViewport: inViewport,
          progress: progress
        };
      });
    };

    Parallaxed.prototype._onDOMChange = function _onDOMChange(evt) {
      this._refreshActiveElements();
      this._checkElements();
    };

    Parallaxed.prototype._onScroll = function _onScroll(evt) {
      this._checkElements();
    };

    Parallaxed.prototype._onResize = function _onResize(evt) {
      this._checkElements();
    };

    createClass(Parallaxed, [{
      key: 'scrollingElement',
      set: function set$$1(value) {
        this._scrollingElement = value;
      },
      get: function get$$1() {
        return this._scrollingElement;
      }
    }, {
      key: 'selectors',
      set: function set$$1(value) {
        this._selectors = value;
        this._refreshActiveElements();
      },
      get: function get$$1() {
        return this._selectors;
      }
    }]);
    return Parallaxed;
  }();

  return Parallaxed;

})));
/* follow me on Twitter! @ryanhefner */
