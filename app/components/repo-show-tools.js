import Ember from 'ember';
import config from 'travis/config/environment';

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

  hasPermission: function() {
    var permissions;
    if (permissions = this.get('currentUser.permissions')) {
      return permissions.contains(parseInt(this.get('repo.id')));
    }
  }.property('currentUser.permissions.length', 'repo.id'),

  hasPushPermission: function() {
    var permissions;
    if (permissions = this.get('currentUser.pushPermissions')) {
      return permissions.contains(parseInt(this.get('repo.id')));
    }
  }.property('currentUser.pushPermissions.length', 'repo.id'),

  hasAdminPermission: function() {
    var permissions;
    if (permissions = this.get('currentUser.adminPermissions')) {
      return permissions.contains(parseInt(this.get('repo.id')));
    }
  }.property('currentUser.adminPermissions.length', 'repo.id'),

  displaySettingsLink: function() {
    return this.get('hasPushPermission');
  }.property('hasPushPermission'),

  displayCachesLink: function() {
    return this.get('hasPushPermission') && config.endpoints.caches;
  }.property('hasPushPermission'),

  displayStatusImages: function() {
    return this.get('hasPermission');
  }.property('hasPermission')
});
