export function initialize() {
  if (!Array.prototype.removeObject) {
    Array.prototype.removeObject = function(item) {
      const index = this.indexOf(item);
      if (index !== -1) {
        this.splice(index, 1);
      }
    };
  }

  if (!Array.prototype.firstObject) {
    Object.defineProperty(Array.prototype, 'firstObject', {
      get: function() {
        return this[0];
      }
    });
  }

  if (!Array.prototype.lastObject) {
    Object.defineProperty(Array.prototype, 'lastObject', {
      get: function() {
        return this[this.length - 1];
      }
    });
  }
}

export default {
  initialize
};
