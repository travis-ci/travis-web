import Controller from '@ember/controller';
import { alias } from 'ember-decorators/object/computed';
import { service } from 'ember-decorators/service';

export default Controller.extend({
  @service auth: null,

  @alias('auth.currentUser') user: null,
  @alias('user.isSyncing') isSyncing: null,
});
