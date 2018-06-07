import Component from '@ember/component';
import { computed } from 'ember-decorators/object';

let sourceToSentence = {
  manual: 'This is a manual subscription.',
  github: 'This subscription is managed by GitHub Marketplace.',
  stripe: 'This plan is paid through Stripe.'
};

export default Component.extend({
  @computed('subscription.plan.currency', 'subscription.plan.price')
  price(currency, price) {
    return `$${price / 100} per month`;
  },

  @computed('subscription.source')
  source(source) {
    return `${sourceToSentence[source]}`;
  },
});
