import { throttle, later } from '@ember/runloop';

export default (function () {
  function Tailing(window1, tailSelector, logSelector) {
    this.window = window1;
    this.document = this.window.document;
    this.tailSelector = tailSelector;
    this.logSelector = logSelector;
    this.position = this._scrollPosTop();
    this.document.addEventListener('scroll', () => {
      throttle(this, this.onScroll, [], 200, false);
    });
    return this;
  }

  Tailing.prototype.options = {
    timeout: 1000,
  };

  Tailing.prototype.tail = function () {
    return this.document.querySelector(this.tailSelector);
  };

  Tailing.prototype.log = function () {
    return this.document.querySelector(this.logSelector);
  };

  Tailing.prototype.run = function () {
    this.autoScroll();
    this.positionButton();
    if (this.active()) {
      return later(this.run.bind(this), this.options.timeout);
    }
  };

  Tailing.prototype.toggle = function () {
    if (this.active()) {
      return this.stop();
    } else {
      return this.start();
    }
  };

  Tailing.prototype.active = function () {
    return this.tail().classList.contains('active');
  };

  Tailing.prototype.start = function () {
    this.tail().classList.add('active');
    return this.run();
  };

  Tailing.prototype.isActive = function () {
    return this.tail().classList.contains('active');
  };

  Tailing.prototype.stop = function () {
    return this.tail().classList.remove('active');
  };

  Tailing.prototype.autoScroll = function () {
    if (!this.active()) {
      return false;
    }
    const log = this.log();
    const logOffset = this._offsetTop(log);
    const logHeight = log.offsetHeight;
    const logBottom = logOffset + logHeight + 40;

    const scrollPosTop = this._scrollPosTop();
    const windowHeight = this.window.innerHeight;
    const winBottom = scrollPosTop + windowHeight;

    const logWinDifference = logBottom - winBottom;

    if (logWinDifference > 0) {
      const newYpos = logBottom - windowHeight;
      const newXpos = this._scrollPosLeft();
      this.window.scrollTo(newXpos, newYpos);
      return true;
    } else {
      return false;
    }
  };

  Tailing.prototype.onScroll = function () {
    let position;
    this.positionButton();
    position = this._scrollPosTop();
    if (position < this.position) {
      this.stop();
    }
    return this.position = position;
  };

  Tailing.prototype.positionButton = function () {
    let max, offset;
    const tail = this.tail();
    const log = this.log();
    if (!tail || getComputedStyle(tail)['position'].search(/sticky/i) >= 0) {
      return;
    }

    offset = this._scrollPosTop() - this._offsetTop(log);
    max = log.clientHeight - tail.clientHeight + 5;
    if (offset > max) {
      offset = max;
    }

    let newOffset = 0;
    if (offset > 0) {
      newOffset = offset - 2;
    }
    tail.style.top = newOffset;

    return newOffset;
  };

  Tailing.prototype._offsetTop = function (el) {
    const { top } = el.getBoundingClientRect();
    const scrollTop = this._scrollPosTop();
    return top + scrollTop;
  };

  Tailing.prototype._scrollPosTop = function () {
    const { document, window } = this;
    return window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || document.getElementsByTagName('html')[0].scrollTop;
  };

  Tailing.prototype._scrollPosLeft = function () {
    const { document, window } = this;
    return window.scrollX || window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || document.getElementsByTagName('html')[0].scrollTop;
  };

  return Tailing;
}());
