import Ember from 'ember';

export default (function () {
  // NOTE: I could have probably extract fixed positioning from
  //       Tailing, but then I would need to parametrize positionElement
  //       function to make it flexible to handle both cases. In that
  //       situation I prefer a bit less DRY code over simplicity of
  //       the calculations.

  function ToTop(window, elementSelector, containerSelector) {
    this.window = window;
    this.elementSelector = elementSelector;
    this.containerSelector = containerSelector;
    this.position = this.window.scrollTop();
    this.window.scroll(() => {
      return Ember.run.throttle(this, this.onScroll, [], 200, false);
    });
    return this;
  }

  ToTop.prototype.element = function () {
    return Ember.$(this.elementSelector);
  };

  ToTop.prototype.container = function () {
    return Ember.$(this.containerSelector);
  };

  ToTop.prototype.onScroll = function () {
    return this.positionElement();
  };

  ToTop.prototype.positionElement = function () {
    var container, containerHeight, element, max, offset, windowHeight;
    element = this.element();
    container = this.container();
    if (element.length === 0) {
      return;
    }
    containerHeight = container.outerHeight();
    windowHeight = this.window.height();
    offset = container.offset().top + containerHeight - (this.window.scrollTop() + windowHeight);
    max = containerHeight - windowHeight;
    if (offset > max) {
      offset = max;
    }
    if (offset > 0) {
      return element.css({
        bottom: offset + 4
      });
    } else {
      return element.css({
        bottom: 2
      });
    }
  };

  return ToTop;
})();
