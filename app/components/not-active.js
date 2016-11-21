import Ember from 'ember';
import config from 'travis/config/environment';

const { service } = Ember.inject;
const { alias } = Ember.computed;

import { task } from 'ember-concurrency';

export default Ember.Component.extend({
  auth: service(),
  flashes: service(),
  permissions: service(),

  user: alias('auth.currentUser'),

  canActivate: Ember.computed('repo.permissions.admin', function () {
    let repo = this.get('repo');
    if (repo) {
      return repo.get('permissions.admin');
    } else {
      return false;
    }
  }),

  activate: task(function* () {
    try {
      yield Ember.RSVP.resolve(true);
    } catch (e) {
      this.get('flashes').error('There was an error while trying to activate the repository.');
    }
  }).drop()
});
