import Ember from 'ember';
import config from 'travis/config/environment';

const { service } = Ember.inject;
const { alias } = Ember.computed;

export default Ember.Component.extend({
  auth: service(),
  popup: service(),
  permissions: service(),

  tagName: 'nav',
  classNames: ['option-button'],
  classNameBindings: ['isOpen:is-open'],
  isOpen: false,

  currentUser: alias('auth.currentUser'),

  click() {
    return this.toggleProperty('isOpen');
  },

  mouseLeave() {
    this.set('isOpen', false);
  },
});
