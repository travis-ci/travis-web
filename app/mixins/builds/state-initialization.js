import Ember from 'ember';

export default Ember.Mixin.create({
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

  contentDidChange() {
    const path = this.get('path');
    // set the controller's model to be a relationship of the currently
    // rendered repository
    // `path` will be something like `repo.pullRequests`
    this.controller.set('model', this.controllerFor('repo').get(path));
  },

  path: Ember.computed('contentType', function () {
    const type = this.get('contentType');
    return 'repo.' + (type.camelize());
  })
});
