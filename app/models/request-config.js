import Model, { attr, belongsTo } from '@ember-data/model';

export default Model.extend({
  // data posted for config validation/expansion
  repo: belongsTo('repo', { async: true }),
  message: attr('string'),
  branch: attr('string'),
  sha: attr('string'),
  mode: attr('string'),
  config: attr('string'),

  // data returned from config validation/expansion
  rawConfigs: attr(),
  requestConfig: attr(),
  jobConfigs: attr(),
  messages: attr(),
});
