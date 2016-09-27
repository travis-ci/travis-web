import Ember from 'ember';
import eventually from 'travis/utils/eventually';

import { task, taskGroup } from 'ember-concurrency';

const { service } = Ember.inject;
const { alias } = Ember.computed;

export default Ember.Mixin.create({
  flashes: service(),
  auth: service(),

  user: alias('auth.currentUser'),

  userHasPermissionForRepo: Ember.computed('user.permissions.[]', 'repo', 'user', function () {
    var repo, user;
    repo = this.get('repo');
    user = this.get('user');
    if (user && repo) {
      return user.hasAccessToRepo(repo);
    }
  }),

  userHasPullPermissionForRepo: Ember.computed('user.pullPermissions.[]', 'repo', 'user', function () {
    const repo = this.get('repo');
    const user = this.get('user');

    if (user && repo) {
      return user.hasPullAccessToRepo(repo);
    }
  }),

  userHasPushPermissionForRepo: Ember.computed('user.pushPermissions.[]', 'repo', 'user', function () {
    const repo = this.get('repo');
    const user = this.get('user');

    if (user && repo) {
      return user.hasPushAccessToRepo(repo);
    }
  }),

  canCancel: Ember.computed.and('userHasPullPermissionForRepo', 'item.canCancel'),
  canRestart: Ember.computed.and('userHasPullPermissionForRepo', 'item.canRestart'),
  canDebug: Ember.computed.and('userHasPushPermissionForRepo', 'item.canDebug'),

  cancel: task(function * () {
    let type = this.get('type');

    yield eventually(this.get('item'), (record) => {
      record.cancel().then(() => {
        this.get('flashes').notice(`${type.capitalize()} has been successfully cancelled.`);
      }, (xhr) => {
        this.displayFlashError(xhr.status, 'cancel');
      });
    });
  }).drop(),

  restarters: taskGroup().drop(),

  restart: task(function * () {
    let type = this.get('type');

    yield eventually(this.get('item'), (record) => {
      record.restart().then(() => {
        this.get('flashes').notice(`The ${type} was successfully restarted.`);
      }, () => {
        this.get('flashes').error(`An error occurred. The ${type} could not be restarted.`);
      });
    });
  }).group('restarters'),

  debug: task(function * () {
    let type = this.get('type');

    yield eventually(this.get('item'), (record) => {
      record.debug().then(() => {
        this.get('flashes')
          .notice(`The ${type} was successfully restarted in debug mode.
            Watch the log for a host to connect to.`);
      }, () => {
        this.get('flashes')
          .error(`An error occurred. The ${type} could not be restarted in debug mode.`);
      });
    });
  }).group('restarters'),

  displayFlashError(status, action) {
    let type = this.get('type');
    if (status === 422 || status === 400) {
      let actionTerm = action === 'restart' ? 'restarted' : 'canceled';
      this.get('flashes').error(`This ${type} can't be ${actionTerm}`);
    } else if (status === 403) {
      let actionTerm = action === 'restart' ? 'restart' : 'cancel';
      this.get('flashes').error(`You don't have sufficient access to ${actionTerm} this ${type}`);
    } else {
      let actionTerm = action === 'restart' ? 'restarting' : 'canceling';
      this.get('flashes').error(`An error occured when ${actionTerm} the ${type}`);
    }
  }
});
