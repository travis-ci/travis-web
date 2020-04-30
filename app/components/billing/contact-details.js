import Component from '@ember/component';

export default Component.extend({
  actions: {
    updateValue(value) {
      this.newSubscription.billingInfo.set('billingEmail', value);
    },
  }
});
