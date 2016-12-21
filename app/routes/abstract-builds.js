import Ember from 'ember';
import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  templateName: 'builds',
  controllerName: 'builds',

  titleToken(/* model*/) {
    return this.get('contentType').replace('_', ' ').capitalize();
  },

  setupController() {
    this.controllerFor('repo').activate(this.get('contentType'));
    this.contentDidChange();
    this.controllerFor('repo').addObserver(this.get('path'), this, 'contentDidChange');
    return this.controllerFor('build').set('contentType', this.get('contentType'));
  },

  deactivate() {
    this.controllerFor('repo').removeObserver(this.get('path'), this, 'contentDidChange');
    return this._super(...arguments);
  },

  contentDidChange() {
    var path;
    path = this.get('path');
    return this.controllerFor('builds').set('model', this.controllerFor('repo').get(path));
  },

  path: Ember.computed('contentType', function () {
    var type;
    type = this.get('contentType');
    return 'repo.' + (type.camelize());
  })
});
