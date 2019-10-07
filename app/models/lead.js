import Model, { attr } from '@ember-data/model';

export default Model.extend({
  name: attr('string'),
  email: attr('string'),
  team_size: attr('number'),
  phone: attr('string'),
  message: attr('string'),
  lead_source: attr('string'),
  utm_fields: attr(),
});
