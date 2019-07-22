import Model, { attr } from '@ember-data/model';

export default Model.extend({
  name: attr('string'),
  value: attr()
});
