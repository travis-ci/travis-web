import Ember from 'ember';

const { service } = Ember.inject;
const { alias } = Ember.computed;

export default Ember.Component.extend({
  auth: service(),
  user: alias('auth.currentUser'),
  classNames: ['sync-button'],
  actions: {
    sync() {
      return this.get('user').sync();
    }
  }
});
