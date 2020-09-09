import Model, { attr, belongsTo } from '@ember-data/model';

export default Model.extend({
  addonQuantity: attr(),
  createdAt: attr('date'),

  addon: belongsTo('addon')
});
