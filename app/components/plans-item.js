import Component from '@ember/component';
import { computed } from 'ember-decorators/object';

export default Component.extend({
  classNames: ['plans-item'],

  @computed('plan.price')
  price(price) {
    return `$${price / 100} per month`;
  },

  @computed('plan.id', 'selectedPlan')
  isSelected(planId, selectedPlan) {
    return planId === selectedPlan;
  },

  click() {
    this.set('selectedPlan', this.get('plan.id'));
  }
});
