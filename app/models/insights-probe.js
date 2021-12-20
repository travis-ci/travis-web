import Model, { attr } from '@ember-data/model';
import { reads, gt } from '@ember/object/computed';
import { computed } from '@ember/object';

export default Model.extend({
  type: attr('string'),
  pluginType: attr('string'),
  pluginTypeName: attr('string'),
  pluginCategory: attr('string'),
  labels: attr(),
  notification: attr('string'),
  status: attr('string'),
  sponsorName: reads('labels.sponsor_name'),
  sponsorUrl: reads('labels.sponsor_url'),
  testTemplateId: attr(),
  description: attr(),
  test: attr(),
  descriptionLink: attr(),
  severity: attr('string'),

  tagList: attr(),
  tagListMore: gt('tagList.length', 3),
  tagMoreCount: computed('tagList', function () {
    return this.tagList.length - 3;
  }),
  showMoreTags: false,
});
