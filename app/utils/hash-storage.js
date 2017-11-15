import EmberObject from '@ember/object';

export default EmberObject.extend({
  init: function () {
    return this.set('storage', {});
  },
  key: function (key) {
    const k = key.replace('.', '__');
    return `__${k}`;
  },
  getItem: function (k) {
    return this.get(`storage.${this.key(k)}`);
  },
  setItem: function (k, v) {
    return this.set(`storage.${this.key(k)}`, v);
  },
  removeItem: function (k) {
    return this.setItem(k, null);
  },
  clear: function () {
    return this.set('storage', {});
  }
});
