import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';
import { computed } from 'ember-decorators/object';
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

  @computed('owner.{type,login}', 'source', 'status')
  billingUrl(type, login, source, status) {
    const id = type === 'user' ? 'user' : login;

    if (source === 'stripe' && (status === 'expired' || status === 'canceled')) {
      return `${config.billingEndpoint}/subscriptions/${id}/edit`;
    } else if (source === 'github') {
      return config.marketplaceEndpoint;
    } else {
      return `${config.billingEndpoint}/subscriptions/${id}`;
    }
  },

  @computed('source', 'status')
  isResubscribe(source, status) {
    return (source === 'stripe' && (status === 'canceled' || status === 'expired'));
  },

  @computed('source', 'status')
  manageSubscription(source, status) {
    return ((source === 'stripe' || source === 'github') && status === 'subscribed');
  },

  @computed('source')
  sourceWords(source) {
    return sourceToWords[source];
  }
});
