import Ember from 'ember';
import config from 'travis/config/environment';
import { hasPermission, hasPushPermission } from 'travis/utils/permission';

export default Ember.Component.extend({
  popup: Ember.inject.service(),
  classNames: ['option-button'],
  classNameBindings: ['isOpen:display'],
  isOpen: false,

  click(event) {
    if ($(event.target).is('a') && $(event.target).parents('.settings-dropdown').length) {
      return this.closeMenu();
    }
  },

  closeMenu() {
    return this.toggleProperty('isOpen');
  },

  actions: {
    menu() {
      return this.toggleProperty('isOpen');
    }
  },
  displaySettingsLink: function() {
    return hasPushPermission(this.get('currentUser'), this.get('repo.id'));
  }.property('currentUser.pushPermissions', 'repo.id'),

  displayCachesLink: function() {
    return hasPushPermission(this.get('currentUser'), this.get('repo.id')) && config.endpoints.caches;
  }.property('currentUser.pushPermissions', 'repo.id'),

  displayStatusImages: function() {
    return hasPermission(this.get('currentUser'), this.get('repo.id'));
  }.property('currentUser.permissions', 'repo.id')

});
