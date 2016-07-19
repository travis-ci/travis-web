import Ember from 'ember';

export default Ember.Controller.extend({
  layoutName: Ember.computed({
    get() {
      if (this._layoutName) {
        return 'layouts/' + this._layoutName;
      }
    },

    set(key, value) {
      return this._layoutName = value;
    }
  })
});
