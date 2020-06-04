import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias, and, or, not, empty, reads } from '@ember/object/computed';
import eventually from 'travis/utils/eventually';
import { task, taskGroup } from 'ember-concurrency';
import {
  bindKeyboardShortcuts,
  unbindKeyboardShortcuts
} from 'ember-keyboard-shortcuts';

export default Component.extend({
  flashes: service(),
  features: service(),
  auth: service(),
  api: service(),

  classNames: ['repo-main-tools'],
  classNameBindings: ['labelless', 'mobilelabels'],
  keyboardShortcuts: {
    'esc': 'toggleConfirmationModal'
  },

  user: alias('auth.currentUser'),

  // Information about elements of options array:
  //
  // `key` is used to match initialKey and selectionKey up with the correct details
  // `displayValue` is used to generate text for the modal
  // `description` is for the label next to the radio button
  // `modalText` can be used to override the generated modal text
  options: computed(() => [
    {
      key: 'private1',
      displayValue: 'item1',
      description: 'Place build at the top of the queue',
      modalText: 'Place build at top of the queue',
    },
    {
      key: 'private2',
      displayValue: 'item2',
      description: 'Place build at the top of the queue and cancel all running jobs',
      modalText: 'Place build at the top of the queue and cancel all running jobs',
    }
  ]),

  isEmpty: empty('options'),
  isVisible: not('isEmpty'),

  isShowingModal: false,
  isShowingConfirmationModal: false,
  isNotShowingConfirmationModal: not('isShowingConfirmationModal'),

  onConfirm() {
    // eslint-disable-next-line
    // const repoId = this.modelFor('repo').get('id');
    // let allTheBranches = ArrayProxy.create();

    // const path = `/repo/${repoId}/branches`;
    // const includes = 'build.commit,build.created_by&limit=100';
    // const url = `${path}?include=${includes}`;

    // return this.api.get(url).then((response) => {
    //   console.log(response);
    //   allTheBranches = response.branches;
    //   return allTheBranches;
    // });
  },

  doAutofocus: false,
  focusOnList: and('doAutofocus', 'isNotShowingConfirmationModal'),
  focusOnModal: and('doAutofocus', 'isShowingConfirmationModal'),

  initialKey: '',
  initial: computed('initialKey', 'options.@each.key', function () {
    return this.options.findBy('key', this.initialKey);
  }),
  initialIndex: computed('initial', 'options.[]', function () {
    return this.options.indexOf(this.initial);
  }),

  selectionKey: reads('initialKey'),
  selection: computed('selectionKey', 'options.@each.key', function () {
    return this.options.findBy('key', this.selectionKey);
  }),
  selectionIndex: computed('selection', 'options.[]', function () {
    return this.options.indexOf(this.selection);
  }),

  didRender() {
    this._super(...arguments);
    let af = this.element.querySelector('[autofocus]');
    if (this.doAutofocus === true && af !== null) {
      af.focus();
      this.set('doAutofocus', false);
    }
  },

  didInsertElement() {
    this._super(...arguments);
    bindKeyboardShortcuts(this);
  },

  willDestroyElement() {
    this._super(...arguments);
    unbindKeyboardShortcuts(this);
  },

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

  canCancel: and('userHasPullPermissionForRepo', 'item.canCancel'),
  canRestart: and('userHasPullPermissionForRepo', 'item.canRestart'),
  canDebug: and('userHasPushPermissionForRepo', 'item.canDebug'),

  tooltips: or('labelless', 'mobilelabels'),

  cancel: task(function* () {
    let type = this.type;

    yield eventually(this.item, (record) => {
      record.cancel().then(() => {
        this.flashes.success(`${type.capitalize()} has been successfully cancelled.`);
      }, (xhr) => {
        this.displayFlashError(xhr.status, 'cancel');
      });
    });
  }).drop(),

  restarters: taskGroup().drop(),

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
          .notice(`The ${type} was successfully restarted in debug mode
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
  },
  actions: {
    // triggerPrioritizeBuildModal() {
    //   this.toggleProperty('isShowingModal');
    // },
    confirm() {
      this.set('isShowingConfirmationModal', false);
      this.onConfirm(this.selectionKey);
    },
    toggleConfirmationModal() {
      this.toggleProperty('isShowingConfirmationModal');
      this.set('doAutofocus', true);
    },
  }

});
