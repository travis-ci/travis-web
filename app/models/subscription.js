import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';
import { computed } from 'ember-decorators/object';
import config from 'travis/config/environment';

let sourceToWords = {
  manual: 'manual',
  github: 'GitHub Marketplace',
  stripe: 'Stripe'
};

export default Model.extend({
  plan: belongsTo(),
  billingInfo: belongsTo({ async: false }),
  creditCardInfo: belongsTo({ async: false }),
  owner: belongsTo('owner', {polymorphic: true}),
  source: attr(),

  invoices: hasMany('invoice'),

  status: attr(),
  validTo: attr('date'),

  @computed('owner.{type,login}', 'source', 'status')
  billingUrl(type, login, source, status) {
    if (source === 'stripe' || status === 'expired') {
      const id = type === 'user' ? 'user' : login;
      return `${config.billingEndpoint}/subscriptions/${id}`;
    } else if (source === 'github') {
      return config.marketplaceEndpoint;
    }
  },

  @computed('source')
  sourceWords(source) {
    return sourceToWords[source];
  }
});
