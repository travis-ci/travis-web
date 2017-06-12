import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    signIn() {
      return this.get('signIn')();
    },

    signOut() {
      return this.get('signOut')();
    },
  },
});
