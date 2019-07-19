import Model, { attr, belongsTo } from '@ember-data/model';

export default Model.extend({
  name: attr('string'),
  value: attr('string'),
  'public': attr('boolean'),
  branch: attr('string'),

  repo: belongsTo('repo', { async: true })
});
