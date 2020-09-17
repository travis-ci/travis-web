import Model, { attr, belongsTo } from '@ember-data/model';

export default Model.extend({
  subscriptionType: attr('number'),
  publicRepos: attr('boolean'),
  privateRepos: attr('boolean'),
  concurrencyLimit: attr('number'),

  subscription: belongsTo('owner')
});
