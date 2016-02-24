import Ember from 'ember';

export default Ember.Mixin.create({
  beforeModel: function() {
    this._super(...arguments);
    window.scrollTo(0,0);
  }
});
