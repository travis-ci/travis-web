import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  billingInfo: belongsTo(),
  creditCardInfo: belongsTo(),
  owner: belongsTo({ polymorphic: true }),
  invoices: hasMany()
});
