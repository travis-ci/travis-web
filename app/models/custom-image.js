import Model, { attr, belongsTo } from '@ember-data/model';

export default Model.extend({
  owner: belongsTo('owner', { polymorphic: true, async: false}),
  name: attr('string'),
  usage: attr('number'),
  createdAt: attr('date'),
  updatedAt: attr('date'),
  osVersion: attr('string'),
  createdBy: attr(),
  private: attr('boolean'),
});
