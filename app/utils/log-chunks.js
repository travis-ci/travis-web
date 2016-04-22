import Ember from 'ember';

var LogChunks = Ember.ArrayProxy.extend({
  timeout: 30000,
  init: function() {
    this.setTimeout();
    return this._super(...arguments);
  },

  resetTimeout: function() {
    var id;
    id = this.get('timeoutId');
    clearTimeout(id);
    return this.setTimeout();
  },

  setTimeout: function() {
    var id;
    id = setTimeout((function(_this) {
      return function() {
        if (_this.get('finalized') || _this.get('isDestroyed')) {
          return;
        }
        _this.triggerMissingParts();
        return _this.setTimeout();
      };
    })(this), this.get('timeout'));
    return this.set('timeoutId', id);
  },

  triggerMissingParts: function() {
    var after, all, callback, content, existing, i, last, missing, ref, results;
    callback = this.get('missingPartsCallback');
    if (!callback) {
      return;
    }
    content = this.get('content');
    last = this.get('last');
    missing = null;
    after = null;
    if (last) {
      existing = content.mapBy('number');
      all = (function() {
        results = [];
        for (var i = 1, ref = last.number; 1 <= ref ? i <= ref : i >= ref; 1 <= ref ? i++ : i--){ results.push(i); }
        return results;
      }).apply(this);
      missing = all.removeObjects(existing);
      if (!last.final) {
        // if last chunk is not final, we should try a few next chunks. At the moment
        // there's no API for that, so let's just try 10 next chunks
        after = last.number;
      }
    }
    return callback(missing, after);
  },

  last: function() {
    var i, last, len, max, part, ref;
    max = -1;
    last = null;
    ref = this.get('content');
    for (i = 0, len = ref.length; i < len; i++) {
      part = ref[i];
      if (part.number > max) {
        max = part.number;
        last = part;
      }
    }
    return last;
  }.property('content.[]', 'final'),

  final: function() {
    return this.get('content').findBy('final', true);
  }.property(),

  tryFinalizing: function() {
    var content, last;
    content = this.get('content');
    last = this.get('last');
    if (last.final && last.number === content.length) {
      return this.set('finalized', true);
    }
  },

  contentArrayDidChange: function(array, index, removedCount, addedCount) {
    var addedObjects, i, len, part;
    this._super(...arguments);
    if (addedCount) {
      addedObjects = array.slice(index, index + addedCount);
      for (i = 0, len = addedObjects.length; i < len; i++) {
        part = addedObjects[i];
        if (part.final) {
          this.notifyPropertyChange('final');
        }
      }
      return Ember.run(this, function() {
        return Ember.run.once(this, function() {
          this.tryFinalizing();
          return this.resetTimeout();
        });
      });
    }
  }
});

export default LogChunks;
