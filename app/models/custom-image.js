import Model, { attr, belongsTo } from '@ember-data/model';
import { computed } from '@ember/object';

export default Model.extend({
  owner: belongsTo('owner', { polymorphic: true, async: false}),
  name: attr('string'),
  usage: attr('number'),
  sizeBytes: attr('number'),
  createdAt: attr('date'),
  updatedAt: attr('date'),
  osVersion: attr('string'),
  createdBy: attr(),
  private: attr('boolean'),

  createdByName: computed('createdBy.name', function () {
    if (!this.createdBy) {
      return '';
    }

    return this.createdBy.name || this.createdBy.login;
  }),
});
