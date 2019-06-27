import Component from '@ember/component';

export default Component.extend({
  selectedPlan: null,
  monthlyPlans: null,

  didReceiveAttrs() {
    this._super(...arguments);
    const defaultPlan = 'Startup';
    const monthlyPlans = this.get('monthlyPlans');
    const startUpPlan = monthlyPlans.findBy('name', defaultPlan);
    this.set('selectedPlan', startUpPlan);
  },

  actions: {
    selectPlan(planId) {
      const monthlyPlans = this.get('monthlyPlans');
      const selectedPlan = monthlyPlans.findBy('id', planId);
      this.set('selectedPlan', selectedPlan);
    }
  }
});
