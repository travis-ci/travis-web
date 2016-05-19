import Ember from 'ember';
import config from 'travis/config/environment';

const { service } = Ember.inject;
const { alias } = Ember.computed;

export default Ember.Component.extend({
  auth: service(),
  popup: service(),
  permissions: service(),

  classNames: ['option-button'],
  classNameBindings: ['isOpen:display'],
  isOpen: false,

  currentUser: alias('auth.currentUser'),

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
    return this.get('permissions').hasPushPermission(this.get('repo'));
  }.property('permissions.all', 'repo'),

  displayCachesLink: function() {
    return this.get('permissions').hasPushPermission(this.get('repo')) && config.endpoints.caches;
  }.property('permissions.all', 'repo'),

  displayStatusImages: function() {
    return this.get('permissions').hasPermission(this.get('repo'));
  }.property('permissions.all', 'repo'),
});
