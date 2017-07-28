import Ember from 'ember';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';
import { alias, and } from 'ember-decorators/object/computed';
import eventually from 'travis/utils/eventually';
import { task, taskGroup } from 'ember-concurrency';

export default Ember.Component.extend({
  @service flashes: null,
  @service auth: null,

  classNames: ['repo-main-tools'],
  classNameBindings: ['labelless'],

  @alias('auth.currentUser') user: null,

  @computed('type', 'job', 'build')
  item(type, job, build) {
    if (type === 'job') {
      return job;
    } else {
      return build;
    }
  },

  @computed('job', 'build')
  type(job) {
    if (job) {
      return 'job';
    } else {
      return 'build';
    }
  },

  @computed('repo', 'user', 'user.permissions.[]')
  userHasPermissionForRepo(repo, user) {
    if (user && repo) {
      return user.hasAccessToRepo(repo);
    }
  },

  @computed('repo', 'user', 'user.pullPermissions.[]')
  userHasPullPermissionForRepo(repo, user) {
    if (user && repo) {
      return user.hasPullAccessToRepo(repo);
    }
  },

  @computed('repo', 'user', 'user.pushPermissions.[]')
  userHasPushPermissionForRepo(repo, user) {
    if (user && repo) {
      return user.hasPushAccessToRepo(repo);
    }
  },

  @and('userHasPullPermissionForRepo', 'item.canCancel') canCancel: null,
  @and('userHasPullPermissionForRepo', 'item.canRestart') canRestart: null,
  @and('userHasPushPermissionForRepo', 'item.canDebug') canDebug: null,

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
