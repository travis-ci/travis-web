import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  value: attr(),
  description: attr(),
  fingerprint: attr(),
  isCustom: true
});
