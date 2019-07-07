import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';
import { and, equal, or } from '@ember/object/computed';
import config from 'travis/config/environment';

let sourceToWords = {
  github: 'GitHub Marketplace',
  manual: 'manual',
  stripe: 'Stripe'
};

export default Model.extend({
  source: attr(),
  status: attr(),
  validTo: attr(),
  permissions: attr(),
  organizationId: attr(),

  billingInfo: belongsTo({ async: false }),
  creditCardInfo: belongsTo({ async: false }),
  invoices: hasMany('invoice'),
  owner: belongsTo('owner', {polymorphic: true}),
  plan: belongsTo(),

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
    let isGithub = this.isGithub;

    const id = type === 'user' ? 'user' : login;

    if (isGithub) {
      return config.marketplaceEndpoint;
    } else {
      return `${config.billingEndpoint}/subscriptions/${id}`;
    }
  }),

  activeManagedSubscription: computed('isStripe', 'isGithub', 'isSubscribed', function () {
    let isStripe = this.isStripe;
    let isGithub = this.isGithub;
    let isSubscribed = this.isSubscribed;
    return ((isStripe || isGithub) && isSubscribed);
  }),

  sourceWords: computed('source', function () {
    let source = this.source;
    return sourceToWords[source];
  }),

  manualSubscriptionExpired: computed('isManual', 'validTo', function () {
    let isManual = this.isManual;
    let validTo = this.validTo;
    let today = new Date().toISOString();
    let date = Date.parse(today);
    let validToDate = Date.parse(validTo);
    return (isManual && (date > validToDate));
  }),
});
