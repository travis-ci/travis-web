import Ember from 'ember';

export default (function() {
  function Tailing(window1, tail_selector, log_selector) {
    this.window = window1;
    this.tail_selector = tail_selector;
    this.log_selector = log_selector;
    this.position = this.window.scrollTop();
    this.window.scroll(() => {
      return Ember.run.throttle(this, this.onScroll, [], 200, false);
    });
    return this;
  }

  Tailing.prototype.options = {
    timeout: 200
  };

  Tailing.prototype.tail = function() {
    return $(this.tail_selector);
  };

  Tailing.prototype.log = function() {
    return $(this.log_selector);
  };



  Tailing.prototype.run = function() {
    this.autoScroll();
    this.positionButton();
    if (this.active()) {
      return Ember.run.later(this.run.bind(this), this.options.timeout);
    }
  };

  Tailing.prototype.toggle = function() {
    if (this.active()) {
      return this.stop();
    } else {
      return this.start();
    }
  };

  Tailing.prototype.active = function() {
    return this.tail().hasClass('active');
  };

  Tailing.prototype.start = function() {
    this.tail().addClass('active');
    return this.run();
  };

  Tailing.prototype.isActive = function() {
    return this.tail().hasClass('active');
  };

  Tailing.prototype.stop = function() {
    return this.tail().removeClass('active');
  };

  Tailing.prototype.autoScroll = function() {
    var logBottom, winBottom;
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

  Tailing.prototype.onScroll = function() {
    var position;
    this.positionButton();
    position = this.window.scrollTop();
    if (position < this.position) {
      this.stop();
    }
    return this.position = position;
  };

  Tailing.prototype.positionButton = function() {
    var max, offset, tail;
    tail = $('#tail');
    if (tail.length === 0) {
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
