import Ember from 'ember';

export default Ember.Mixin.create({
  beforeModel: function () {
    window.scrollTo(0, 0);
    return this._super(...arguments);
  }
});
