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

  if (!Array.prototype.pushObject) {
    Array.prototype.pushObject = function(item) {
      this.push(item);
      return this;
    };
  }

  if (!Array.prototype.uniq) {
    Array.prototype.uniq = function() {
      return Array.from(new Set(this));
    };
  }

  if (!Array.prototype.addObject) {
    Array.prototype.addObject = function(item) {
      if (this.indexOf(item) === -1) {
        this.push(item);
      }
      return this;
    };
  }

  if (!Array.prototype.addObjects) {
    Array.prototype.addObjects = function(items) {
      items.forEach(item => {
        this.addObject(item);
      });
      return this;
    };
  }

}

export default {
  initialize
};
