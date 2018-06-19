import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';
import { computed } from 'ember-decorators/object';
import config from 'travis/config/environment';

export default Model.extend({
  plan: belongsTo(),
  billingInfo: belongsTo({ async: false }),
  creditCardInfo: belongsTo({ async: false }),
  owner: belongsTo('owner', {polymorphic: true}),
  source: attr(),

  invoices: hasMany('invoice'),

  status: attr(),
  validTo: attr('date'),

  @computed('owner.{type,login}', 'source')
  billingUrl(type, login, source) {
    if (source === 'stripe') {
      const id = type === 'user' ? 'user' : login;
      return `${config.billingEndpoint}/subscriptions/${id}`;
    } else if (source === 'github') {
      return config.marketplaceEndpoint;
    }
  },
});
