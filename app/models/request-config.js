import Model, { attr } from '@ember-data/model';

export default Model.extend({
  rawConfigs: attr(),
  requestConfig: attr(),
  jobConfigs: attr(),
  messages: attr(),
});
