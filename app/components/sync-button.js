import Ember from 'ember';
import { service } from 'ember-decorators/service';
import { alias } from 'ember-decorators/object/computed';

export default Ember.Component.extend({
  @service auth: null,

  @alias('auth.currentUser') user: null,
  classNames: ['sync-button'],

  actions: {
    sync() {
      return this.get('user').sync();
    }
  }
});
