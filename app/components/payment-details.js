import Component from '@ember/component';
import { computed } from 'ember-decorators/object';
import { equal, not } from 'ember-decorators/object/computed';

let sourceToSentence = {
  manual: 'This is a manual subscription.',
  github: 'This subscription is managed by GitHub Marketplace.',
  stripe: 'This plan is paid through Stripe.'
};

export default Component.extend({
  @computed('subscription.plan.currency', 'subscription.plan.price', 'subscription.plan.annual')
  price(currency, price, annual) {
    return `$${price / 100} per ${annual ? 'year' : 'month'}`;
  },

  @computed('subscription.source')
  source(source) {
    return `${sourceToSentence[source]}`;
  },

  @equal('subscription.source', 'stripe') stripe: null,
  @equal('subscription.source', 'manual') manual: null,

  @not('subscription.plan.annual') monthly: null,
});
