import { throttle, later } from '@ember/runloop';

export default (function () {
  function Tailing(tailSelector, logSelector) {
    this.tailSelector = tailSelector;
    this.logSelector = logSelector;
    this.position = this._scrollPosTop();
    document.addEventListener('scroll', () => {
      throttle(this, this.onScroll, [], 200, false);
    });
    return this;
  }

  Tailing.prototype.options = {
    timeout: 1000,
  };

  Tailing.prototype.tail = function () {
    return document.querySelector(this.tailSelector);
  };

  Tailing.prototype.log = function () {
    return document.querySelector(this.logSelector);
  };

  Tailing.prototype.run = function () {
    this.autoScroll();
    this.positionButton();
    if (this.isActive()) {
      return later(this.run.bind(this), this.options.timeout);
    }
  };

  Tailing.prototype.toggle = function () {
    if (this.isActive()) {
      return this.stop();
    } else {
      return this.start();
    }
  };

  Tailing.prototype.start = function () {
    const tail = this.tail();
    if (tail) {
      tail.classList.add('active');
    }
    return this.run();
  };

  Tailing.prototype.isActive = function () {
    const tail = this.tail();
    return tail && tail.classList.contains('active');
  };

  Tailing.prototype.stop = function () {
    const tail = this.tail();
    return tail && tail.classList.remove('active');
  };

  Tailing.prototype.autoScroll = function () {
    if (!this.isActive()) {
      return false;
    }
    const log = this.log();
    const logOffset = this._offsetTop(log);
    const logHeight = log.offsetHeight;
    const logBottom = logOffset + logHeight + 40;

    const scrollPosTop = this._scrollPosTop();
    const windowHeight = window.innerHeight;
    const winBottom = scrollPosTop + windowHeight;

    const logWinDifference = logBottom - winBottom;

    if (logWinDifference > 0) {
      const newYpos = logBottom - windowHeight;
      const newXpos = this._scrollPosLeft();
      window.scrollTo(newXpos, newYpos);
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
    return window && window.pageYOffset;
  };

  Tailing.prototype._scrollPosLeft = function () {
    return window && window.pageXOffset;
  };

  return Tailing;
}());
