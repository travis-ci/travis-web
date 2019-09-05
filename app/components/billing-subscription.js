import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { reads, and, not } from '@ember/object/computed';
import { computed } from '@ember/object';

const sourceToSentence = {
  manual: 'This is a manual subscription.',
  github: 'This subscription is managed by GitHub Marketplace.',
  stripe: 'This plan is paid through Stripe.'
};
export default Component.extend({
  plan: service(),

  account: null,
  newSubscriptionProcess: false,

  subscription: reads('account.subscription'),
  plans: reads('plan.plans'),
  trial: reads('account.trial'),
  price: reads('subscription.plan.price'),
  isGithubTrial: and('subscription.isGithub', 'trial.hasActiveTrial'),
  authenticationNotRequired: not('subscription.clientSecret'),
  isPending: and('subscription.isPending', 'authenticationNotRequired'),

  source: computed('subscription.source', function () {
    const source = this.subscription.source;
    return `${sourceToSentence[source]}`;
  }),
});
