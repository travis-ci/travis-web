import Ember from 'ember';
import { alias } from 'ember-decorators/object/computed';

export default Ember.Controller.extend({
  @alias('auth.currentUser') user: null,
  @alias('user.isSyncing') isSyncing: null,
});
