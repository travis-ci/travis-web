import Ember from 'ember';
import config from 'travis/config/environment';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';

export default Ember.Component.extend({
  @service auth: null,
  @service popup: null,
  @service permissions: null,

  tagName: 'nav',
  classNames: ['option-button'],
  classNameBindings: ['isOpen:is-open'],
  isOpen: false,

  @alias('auth.currentUser') currentUser: null,

  click() {
    return this.toggleProperty('isOpen');
  },

  mouseLeave() {
    this.set('isOpen', false);
  },

  @computed('permissions.all', 'repo')
  displaySettingsLink(permissions, repo) {
    return this.get('permissions').hasPushPermission(repo);
  },

  @computed('permissions.all', 'repo')
  displayCachesLink(permissions, repo) {
    return this.get('permissions').hasPushPermission(repo) && config.endpoints.caches;
  },

  @computed('permissions.all', 'repo')
  displayStatusImages(permissions, repo) {
    return this.get('permissions').hasPermission(repo);
  },
});
