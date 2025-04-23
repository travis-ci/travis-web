import Model, { attr, belongsTo } from '@ember-data/model';

export default Model.extend({
  owner: belongsTo('owner', { polymorphic: true, async: false}),
  name: attr('string'),
  usage: attr('number'),
  createdAt: attr('date'),
  updatedAt: attr('date'),
  osVersion: attr('string'),
  createdBy: belongsTo('user', { async: false, inverse: null }),
  private: attr('boolean'),
});
