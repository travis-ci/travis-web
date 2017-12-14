import Component from '@ember/component';

export default Component.extend({
  actions: {
    signIn() {
      this.get('signIn')();
    }
  }
});
