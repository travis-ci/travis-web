import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias, and, not, or, reads } from '@ember/object/computed';
import eventually from 'travis/utils/eventually';
import { task, taskGroup } from 'ember-concurrency';
import { capitalize } from '@ember/string';

export default Component.extend({
  flashes: service(),
  features: service(),
  auth: service(),

  classNames: ['repo-main-tools'],
  classNameBindings: ['labelless', 'mobilelabels'],

  user: alias('auth.currentUser'),

  item: computed('type', 'job', 'build', function () {
    let type = this.type;
    let job = this.job;
    let build = this.build;
    if (type === 'job') {
      return job;
    } else {
      return build;
    }
  }),

  type: computed('job', 'build', function () {
    let job = this.job;
    if (job) {
      return 'job';
    } else {
      return 'build';
    }
  }),

  userHasPermissionForRepo: computed('repo.id', 'user', 'user.permissions.[]', function () {
    let repo = this.repo;
    let user = this.user;

    if (user && repo) {
      return user.hasAccessToRepo(repo);
    }
  }),

  userHasPullPermissionForRepo: computed('repo.id', 'user', 'user.pullPermissions.[]', function () {
    let repo = this.repo;
    let user = this.user;
    if (user && repo) {
      return user.hasPullAccessToRepo(repo);
    }
  }),

  userHasPushPermissionForRepo: computed('repo.id', 'user', 'user.pushPermissions.[]', function () {
    let repo = this.repo;
    let user = this.user;
    if (user && repo) {
      return user.hasPushAccessToRepo(repo);
    }
  }),
  userHasCancelPermissionForRepo: computed('repo.id', 'user', function () {
    let repo = this.repo;
    let user = this.user;
    if (user && repo) {
      return user.hasPermissionToRepo(repo, 'build_cancel');
    }
  }),
  userHasRestartPermissionForRepo: computed('repo.id', 'user', function () {
    let repo = this.repo;
    let user = this.user;
    if (user && repo) {
      return user.hasPermissionToRepo(repo, 'build_restart');
    }
  }),
  userHasDebugPermissionForRepo: computed('repo.id', 'user', function () {
    let repo = this.repo;
    let user = this.user;
    if (user && repo) {
      return user.hasPermissionToRepo(repo, 'build_debug');
    }
  }),

  canOwnerBuild: reads('repo.canOwnerBuild'),
  ownerRoMode: reads('repo.owner.ro_mode'),
  userRoMode: reads('user.roMode'),
  isOwnerConfirmed: computed('auth.currentUser.confirmedAt', function () {
    return this.auth.currentUser && this.auth.currentUser.confirmedAt;
  }),

  showPriority: true,
  showPrioritizeBuildModal: false,
  canCancel: and('userHasCancelPermissionForRepo', 'item.canCancel'),
  canRestart: and('userHasRestartPermissionForRepo', 'item.canRestart'),
  canDebug: and('userHasDebugPermissionForRepo', 'item.canDebug'),
  isHighPriority: or('item.priority', 'item.build.priority'),
  isNotAlreadyHighPriority: not('isHighPriority'),
  hasPrioritizePermission: or('item.permissions.prioritize', 'item.build.permissions.prioritize'),
  canPrioritize: and('item.notStarted', 'isNotAlreadyHighPriority', 'hasPrioritizePermission'),
  insufficientPermissions: not('userHasPushPermissionForRepo'),
  tooltips: or('labelless', 'mobilelabels'),

  cancel: task(function* () {
    let type = this.type;

    yield eventually(this.item, (record) => {
      record.cancel().then(() => {
        this.flashes.success(`${capitalize(type)} has been successfully cancelled.`);
      }, (xhr) => {
        this.displayFlashError(xhr.status, 'cancel');
      });
    });
  }).drop(),

  restarters: taskGroup().drop(),

  closePriorityModal: function () {
    this.set('showPrioritizeBuildModal', false);
  },

  showPriorityModal: function () {
    this.set('showPrioritizeBuildModal', true);
  },

  restart: task(function* () {
    let type = this.type;

    yield eventually(this.item, (record) => {
      record.restart().then(() => {
        this.flashes.success(`The ${type} was successfully restarted.`);
      }, () => {
        this.flashes.error(`An error occurred. The ${type} could not be restarted.`);
      });
    });
  }).group('restarters'),

  debug: task(function* () {
    let type = this.type;

    yield eventually(this.item, (record) => {
      record.debug().then(() => {
        this.flashes
          .warning(`The ${type} was successfully restarted in debug mode
            but make sure to watch the log for a host to connect to.`);
      }, () => {
        this.flashes
          .error(`An error occurred. The ${type} could not be restarted in debug mode.`);
      });
    });
  }).group('restarters'),

  displayFlashError(status, action) {
    let type = this.type;
    if (status === 422 || status === 400) {
      let actionTerm = action === 'restart' ? 'restarted' : 'canceled';
      this.flashes.error(`This ${type} can’t be ${actionTerm}`);
    } else if (status === 403) {
      let actionTerm = action === 'restart' ? 'restart' : 'cancel';
      this.flashes.error(`You don’t have sufficient access to ${actionTerm} this ${type}`);
    } else {
      let actionTerm = action === 'restart' ? 'restarting' : 'canceling';
      this.flashes.error(`An error occurred when ${actionTerm} the ${type}`);
    }
  }
});
