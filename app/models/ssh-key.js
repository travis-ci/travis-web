import Model, { attr } from '@ember-data/model';

export default Model.extend({
  value: attr('string'),
  description: attr('string'),
  fingerprint: attr(),

  isCustom: true
});
