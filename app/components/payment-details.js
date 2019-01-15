import Component from '@ember/component';
import { computed } from '@ember/object';
import { not } from '@ember/object/computed';
import config from 'travis/config/environment';

let sourceToSentence = {
  manual: 'This is a manual subscription.',
  github: 'This subscription is managed by GitHub Marketplace.',
  stripe: 'This plan is paid through Stripe.'
};

export default Component.extend({
  config,

  price: computed('subscription.plan.price', 'subscription.plan.annual', function () {
    let price = this.get('subscription.plan.price');
    let annual = this.get('subscription.plan.annual');
    return `$${price / 100} per ${annual ? 'year' : 'month'}`;
  }),

  source: computed('subscription.source', function () {
    let source = this.get('subscription.source');
    return `${sourceToSentence[source]}`;
  }),

  monthly: not('subscription.plan.annual'),
});
