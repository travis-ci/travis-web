import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  classNames: ['feature'],

  name: Ember.computed('feature.name', function () {
    return this.get('feature.name').capitalize();
  })
});
