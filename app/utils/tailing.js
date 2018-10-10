import $ from 'jquery';
import { throttle, later } from '@ember/runloop';

export default (function () {
  function Tailing(window1, tailSelector, logSelector) {
    this.window = window1;
    this.tailSelector = tailSelector;
    this.logSelector = logSelector;
    this.position = this.window.scrollTop();
    this.window.scroll(() => {
      throttle(this, this.onScroll, [], 200, false);
    });
    return this;
  }

  Tailing.prototype.options = {
    timeout: 200
  };

  Tailing.prototype.tail = function () {
    return $(this.tailSelector);
  };

  Tailing.prototype.log = function () {
    return $(this.logSelector);
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
    return this.tail().hasClass('active');
  };

  Tailing.prototype.start = function () {
    this.tail().addClass('active');
    return this.run();
  };

  Tailing.prototype.isActive = function () {
    return this.tail().hasClass('active');
  };

  Tailing.prototype.stop = function () {
    return this.tail().removeClass('active');
  };

  Tailing.prototype.autoScroll = function () {
    let logBottom, winBottom;
    if (!this.active()) {
      return false;
    }
    logBottom = this.log().offset().top + this.log().outerHeight() + 40;
    winBottom = this.window.scrollTop() + this.window.height();
    if (logBottom - winBottom > 0) {
      this.window.scrollTop(logBottom - this.window.height());
      return true;
    } else {
      return false;
    }
  };

  Tailing.prototype.onScroll = function () {
    let position;
    this.positionButton();
    position = this.window.scrollTop();
    if (position < this.position) {
      this.stop();
    }
    return this.position = position;
  };

  Tailing.prototype.positionButton = function () {
    let max, offset, tail;
    tail = $('#tail');
    if (tail.length === 0 || tail.css('position').search(/sticky/i) >= 0) {
      return;
    }
    offset = $(window).scrollTop() - $('#log').offset().top;
    max = $('#log').height() - $('#tail').height() + 5;
    if (offset > max) {
      offset = max;
    }
    if (offset > 0) {
      return tail.css({
        top: offset - 2
      });
    } else {
      return tail.css({
        top: 0
      });
    }
  };

  return Tailing;
})();
