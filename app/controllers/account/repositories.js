import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['legacy-page', 'apps-page'],
  'legacy-page': 1,
  'apps-page': 1
});
