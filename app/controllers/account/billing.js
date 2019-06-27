import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

export default Controller.extend({
  allPlans: alias('model.plans'),
  plansToShow: ['Bootstrap', 'Startup', 'Premium', 'Small Business'],

  monthlyPlans: computed('allPlans', function () {
    const monthlyPlans =  this.allPlans.filter(plan => {
      const { annual, builds, name } = plan;
      return !annual && builds <= 10 && this.plansToShow.includes(name);
    });
    return monthlyPlans;
  })
});
