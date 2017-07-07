import Ember from 'ember';

export default Ember.Component.extend({
  features: Ember.inject.service(),
  tagName: 'footer',
  classNames: ['footer']
});
