import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias, and, or } from '@ember/object/computed';
import eventually from 'travis/utils/eventually';
import { task, taskGroup } from 'ember-concurrency';

export default Component.extend({
  flashes: service(),
  features: service(),
  auth: service(),

  classNames: ['repo-main-tools'],
  classNameBindings: ['labelless', 'mobilelabels'],

  user: alias('auth.currentUser'),

  item: computed('type', 'job', 'build', function () {
    let type = this.get('type');
    let job = this.get('job');
    let build = this.get('build');
    if (type === 'job') {
      return job;
    } else {
      return build;
    }
  }),

  type: computed('job', 'build', function () {
    let job = this.get('job');
    if (job) {
      return 'job';
    } else {
      return 'build';
    }
  }),

  userHasPermissionForRepo: computed('repo', 'user', 'user.permissions.[]', function () {
    let repo = this.get('repo');
    let user = this.get('user');
    if (user && repo) {
      return user.hasAccessToRepo(repo);
    }
  }),

  userHasPullPermissionForRepo: computed('repo', 'user', 'user.pullPermissions.[]', function () {
    let repo = this.get('repo');
    let user = this.get('user');
    if (user && repo) {
      return user.hasPullAccessToRepo(repo);
    }
  }),

  userHasPushPermissionForRepo: computed('repo', 'user', 'user.pushPermissions.[]', function () {
    let repo = this.get('repo');
    let user = this.get('user');
    if (user && repo) {
      return user.hasPushAccessToRepo(repo);
    }
  }),

  canCancel: and('userHasPullPermissionForRepo', 'item.canCancel'),
  canRestart: and('userHasPullPermissionForRepo', 'item.canRestart'),
  canDebug: and('userHasPushPermissionForRepo', 'item.canDebug'),

  tooltips: or('labelless', 'mobilelabels'),

  cancel: task(function* () {
    let type = this.get('type');

    yield eventually(this.get('item'), (record) => {
      record.cancel().then(() => {
        this.get('flashes').success(`${type.capitalize()} has been successfully cancelled.`);
      }, (xhr) => {
        this.displayFlashError(xhr.status, 'cancel');
      });
    });
  }).drop(),

  restarters: taskGroup().drop(),

  restart: task(function* () {
    let type = this.get('type');

    yield eventually(this.get('item'), (record) => {
      record.restart().then(() => {
        this.get('flashes').success(`The ${type} was successfully restarted.`);
      }, () => {
        this.get('flashes').error(`An error occurred. The ${type} could not be restarted.`);
      });
    });
  }).group('restarters'),

  debug: task(function* () {
    let type = this.get('type');

    yield eventually(this.get('item'), (record) => {
      record.debug().then(() => {
        this.get('flashes')
          .notice(`The ${type} was successfully restarted in debug mode
            but make sure to watch the log for a host to connect to.`);
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
      this.get('flashes').error(`This ${type} can’t be ${actionTerm}`);
    } else if (status === 403) {
      let actionTerm = action === 'restart' ? 'restart' : 'cancel';
      this.get('flashes').error(`You don’t have sufficient access to ${actionTerm} this ${type}`);
    } else {
      let actionTerm = action === 'restart' ? 'restarting' : 'canceling';
      this.get('flashes').error(`An error occurred when ${actionTerm} the ${type}`);
    }
  }
});
