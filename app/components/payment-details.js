import Component from '@ember/component';
import { computed } from 'ember-decorators/object';
import { not } from 'ember-decorators/object/computed';
import config from 'travis/config/environment';

let sourceToSentence = {
  manual: 'This is a manual subscription.',
  github: 'This subscription is managed by GitHub Marketplace.',
  stripe: 'This plan is paid through Stripe.'
};

export default Component.extend({
  config,

  @computed('subscription.plan.price', 'subscription.plan.annual')
  price(price, annual) {
    return `$${price / 100} per ${annual ? 'year' : 'month'}`;
  },

  @computed('subscription.source')
  source(source) {
    return `${sourceToSentence[source]}`;
  },

  @not('subscription.plan.annual') monthly: null,
});
