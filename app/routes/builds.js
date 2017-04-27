import TravisRoute from 'travis/routes/basic';

const mixins = [];

export default TravisRoute.extend(...mixins, {
  setupController() {
    this.controllerFor('repo').activate(this.get('contentType'));
    this.controller.set('model', this.controllerFor('repo').get(this.get('path')));
    this.controllerFor('build').set('contentType', this.get('contentType'));
  },

  titleToken() {
    return 'Builds';
  },

  path: 'repo.builds',

  contentType: 'builds'
});
