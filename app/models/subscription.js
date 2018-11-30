import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';
import { computed } from '@ember/object';
import { and, equal, or } from '@ember/object/computed';
import config from 'travis/config/environment';

let sourceToWords = {
  github: 'GitHub Marketplace',
  manual: 'manual',
  stripe: 'Stripe'
};

export default Model.extend({
  billingInfo: belongsTo({ async: false }),
  creditCardInfo: belongsTo({ async: false }),
  invoices: hasMany('invoice'),
  owner: belongsTo('owner', {polymorphic: true}),
  permissions: attr(),
  plan: belongsTo(),
  source: attr(),
  status: attr(),
  validTo: attr(),

  isSubscribed: equal('status', 'subscribed'),
  isCanceled: equal('status', 'canceled'),
  isExpired: equal('status', 'expired'),
  isStripe: equal('source', 'stripe'),
  isGithub: equal('source', 'github'),
  isManual: equal('source', 'manual'),
  isNotSubscribed: or('isCanceled', 'isExpired'),
  managedSubscription: or('isStripe', 'isGithub'),
  isResubscribable: and('isStripe', 'isNotSubscribed'),
  isGithubResubscribable: and('isGithub', 'isNotSubscribed'),

  billingUrl: computed('owner.{type,login}', 'isGithub', 'isResubscribable', function () {
    let type = this.get('owner.type');
    let login = this.get('owner.login');
    let isGithub = this.get('isGithub');

    const id = type === 'user' ? 'user' : login;

    if (isGithub) {
      return config.marketplaceEndpoint;
    } else {
      return `${config.billingEndpoint}/subscriptions/${id}`;
    }
  }),

  activeManagedSubscription: computed('isStripe', 'isGithub', 'isSubscribed', function () {
    let isStripe = this.get('isStripe');
    let isGithub = this.get('isGithub');
    let isSubscribed = this.get('isSubscribed');
    return ((isStripe || isGithub) && isSubscribed);
  }),

  sourceWords: computed('source', function () {
    let source = this.get('source');
    return sourceToWords[source];
  }),

  manualSubscriptionExpired: computed('isManual', 'validTo', function () {
    let isManual = this.get('isManual');
    let validTo = this.get('validTo');
    let today = new Date().toISOString();
    let date = Date.parse(today);
    let validToDate = Date.parse(validTo);
    return (isManual && (date > validToDate));
  }),
});
