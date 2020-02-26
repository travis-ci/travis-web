import Model, { attr } from '@ember-data/model';

export default Model.extend({
  rawConfigs: attr(),
  config: attr(),
  matrix: attr(),
  stages: attr(),
  messages: attr(),
  fullMessages: attr(),

  parse(configs) {
    return this.request('/parse', 'POST', {
      data: this.normalize(configs),
      contentType: 'application/vnd.travis-ci.configs+json'
    });
  },
});
