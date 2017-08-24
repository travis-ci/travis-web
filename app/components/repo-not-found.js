import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    signIn() {
      this.get('signIn')();
    }
  }
});
