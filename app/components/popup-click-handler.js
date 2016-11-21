import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Component.extend({
  popup: service(),
  classNames: ['application'],

  click() {
    if (window) {
      window.alert('This is broken due to FastBoot!');
    }
  }
});
