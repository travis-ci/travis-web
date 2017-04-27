import TravisRoute from 'travis/routes/basic';

const mixins = [];

export default TravisRoute.extend(...mixins, {
  setupController() {
    this.controllerFor('repo').activate(this.get('contentType'));
    this.contentDidChange();
    this.controllerFor('repo').addObserver(this.get('path'), this, 'contentDidChange');
    this.controllerFor('build').set('contentType', this.get('contentType'));
  },

  deactivate() {
    this.controllerFor('repo').removeObserver(this.get('path'), this, 'contentDidChange');
    this._super(...arguments);
  },

  model() {
    return this.controllerFor('repo').get(this.get('path'));
  },

  contentDidChange() {
    // set the controller's model to be a relationship of the currently
    // rendered repository
    // `path` will be something like `repo.pullRequests`
    this.controller.set('model', this.controllerFor('repo').get(this.get('path')));
  },

  titleToken() {
    return 'Builds';
  },

  path: 'repo.builds',

  contentType: 'builds'
});
