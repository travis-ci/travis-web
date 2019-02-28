import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['legacyPage', 'appsPage'],
  legacyPage: 1,
  appsPage: 1
});
