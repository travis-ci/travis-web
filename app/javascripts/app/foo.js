window.Util = window.Util || {}

window.Util.counter = (function () {
  var value = 0;

  return {
    getValue: function () {
      return value;
    },
    increment: function (i) {
      if (!i) i = 1;
      return value += i;
    },
    decrement: function (i) {
      if (!i) i = 1;
      return value -= i;
    },
    reset: function (i) {
      if (!i) i = 0;
      return value = i;
    }
  }
}());
