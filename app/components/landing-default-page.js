import Component from '@ember/component';

export default Component.extend({
  actions: {
    signIn() {
      return this.get('signIn')();
    },

    signOut() {
      return this.get('signOut')();
    },
  },
});
