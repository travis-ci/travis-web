import Ember from 'ember';
import config from 'travis/config/environment';
import { hasPermission, hasPushPermission } from 'travis/utils/permission';

const { service } = Ember.inject;

export default Ember.Component.extend({
  popup: service(),
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
  }.property('currentUser.pushPermissions.length', 'repo'),

  displayCachesLink: function() {
    return hasPushPermission(this.get('currentUser'), this.get('repo.id')) && config.endpoints.caches;
  }.property('currentUser.pushPermissions.length', 'repo'),

  displayStatusImages: function() {
    return hasPermission(this.get('currentUser'), this.get('repo.id'));
  }.property('currentUser.permissions.length', 'repo.id')

});
