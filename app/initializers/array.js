import { A } from '@ember/array'

export function initialize() {
  if (!Array.prototype.compact) {
    Array.prototype.compact = function(...params) {
      return A(this).compact(...params)
    };
  }

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
      return this.length;
    };
  }

  if (!Array.prototype.uniq) {
    Array.prototype.uniq = function() {
      return Array.from(new Set(this));
    };
  }

  if (!Array.prototype.addObject) {
    Array.prototype.addObject = function (item) {
      if (this.indexOf(item) === -1) {
        this.push(item);
      }
      return this;
    };
  }

  if (!Array.prototype.any) {
    Array.prototype.any = function(...args) {
      return this.some(...args);
    }
  }


  if (!Array.prototype.mapBy) {
    Array.prototype.mapBy = function(property) {
      return this.map(item => item[property]);
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

  if (!Array.prototype.filterBy) {
    Array.prototype.filterBy = function(...params) {
      return A(this).filterBy(...params);
    }
  }

  if (!Array.prototype.get) {
    Array.prototype.get = function (what) {
      let properties = what.split('.');
      let result = A(this);

      for (let i = 0; i < properties.length; i++) {
        // 5 is my own limit so can be .get[aa.bb.cc.dd.ee]  - max nesting of 5
        if (result === undefined || result === null || i === 5) {
          return undefined;
        }
        result = result[properties[i]];
      }

      return result;
    }
  }

  if (!Array.prototype.isAny) {
    Array.prototype.isAny = function(...params) {
      return A(this).isAny(...params)
    }
  }

  if (!Array.prototype.findBy) {
    Array.prototype.findBy = function(...params) {
      return A(this).findBy(...params)
    }
  }

  if (!Array.prototype.uniqBy) {
    Array.prototype.uniqBy = function(...params) {
      return A(this).uniqBy(...params)
    }
  }

  if (!Array.prototype.unshiftObject) {
    Array.prototype.unshiftObject = function(...params) {
      return A(this).unshiftObject(...params)
    }
  }

  if (!Array.prototype.pushObjects) {
    Array.prototype.pushObjects = function(...objects) {
      this.push(...objects);
    }

    return this.length;
  }

  if (!Array.prototype.without) {
    Array.prototype.without = function(...params) {
      return A(this).without(...params)
    }
  }


  if (!Array.prototype.sort) {
    Array.prototype.sort = function(...params) {
      return A(this).sort(...params)
    }
  }

  if (!Array.prototype.rejectBy) {
    Array.prototype.rejectBy = function(...params) {
      return A(this).rejectBy(...params)
    }
  }

  if (!Array.prototype.sortBy) {
    Array.prototype.sortBy = function(...params) {
      return A(this).sortBy(...params)
    }
  }
}

export default {
  initialize
};
