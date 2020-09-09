import Model, { attr, belongsTo } from '@ember-data/model';

export default Model.extend({
  addonConfigId: attr('string'),
  createdAt: attr('date'),
  currentUsage: belongsTo('addonUsage'),

  subscription: belongsTo('v2-subscription')
});
