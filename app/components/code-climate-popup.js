import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    close() {
      $('.popup').removeClass('display');
      return false;
    }
  }
});
