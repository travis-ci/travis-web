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
    if (Ember.$(event.target).is('a') && Ember.$(event.target).parents('.settings-dropdown').length) {
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
  displaySettingsLink: Ember.computed('permissions.all', 'repo', function () {
    return this.get('permissions').hasPushPermission(this.get('repo'));
  }),

  displayCachesLink: Ember.computed('permissions.all', 'repo', function () {
    return this.get('permissions').hasPushPermission(this.get('repo')) && config.endpoints.caches;
  }),

  displayStatusImages: Ember.computed('permissions.all', 'repo', function () {
    return this.get('permissions').hasPermission(this.get('repo'));
  })
});
