import Controller from '@ember/controller';
import { alias } from 'ember-decorators/object/computed';

export default Controller.extend({
  @alias('auth.currentUser') user: null,
  @alias('user.isSyncing') isSyncing: null,
});
