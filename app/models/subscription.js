import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';
import { computed } from 'ember-decorators/object';
import { and, equal, or } from 'ember-decorators/object/computed';
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
  validTo: attr('date'),

  @equal('status', 'subscribed') isSubscribed: null,
  @equal('status', 'canceled') isCanceled: null,
  @equal('status', 'expired') isExpired: null,
  @equal('source', 'stripe') isStripe: null,
  @equal('source', 'github') isGithub: null,
  @equal('source', 'manual') isManual: null,

  @or('isCanceled', 'isExpired') isNotSubscribed: null,

  @and('isStripe', 'isNotSubscribed') isResubscribable: null,


  @computed('owner.{type,login}', 'isGithub', 'isResubscribable')
  billingUrl(type, login, isGithub, isResubscribable) {
    const id = type === 'user' ? 'user' : login;

    if (isGithub) {
      return config.marketplaceEndpoint;
    } else {
      return `${config.billingEndpoint}/subscriptions/${id}`;
    }
  },

  @computed('isStripe', 'isGithub', 'isSubscribed')
  manageSubscription(isStripe, isGithub, isSubscribed) {
    return ((isStripe || isGithub) && isSubscribed);
  },

  @computed('source')
  sourceWords(source) {
    return sourceToWords[source];
  }
});
