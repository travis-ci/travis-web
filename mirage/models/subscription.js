import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  plan: belongsTo(),
  billingInfo: belongsTo(),
  creditCardInfo: belongsTo(),
  discount: belongsTo(),
  owner: belongsTo({ polymorphic: true }),
  invoices: hasMany()
});
