import Ember from 'ember';

export default Ember.Object.extend({
  init: function() {
    return this.set('storage', {});
  },
  key: function(key) {
    return "__" + (key.replace('.', '__'));
  },
  getItem: function(k) {
    return this.get("storage." + (this.key(k)));
  },
  setItem: function(k, v) {
    return this.set("storage." + (this.key(k)), v);
  },
  removeItem: function(k) {
    return this.setItem(k, null);
  },
  clear: function() {
    return this.set('storage', {});
  }
});
