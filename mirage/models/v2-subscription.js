import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  plan: belongsTo('v2-plan-config'),
  billingInfo: belongsTo('v2-billing-info'),
  creditCardInfo: belongsTo('v2-credit-card-info'),
  discount: belongsTo(),
  owner: belongsTo({ polymorphic: true }),
  invoices: hasMany()
});
