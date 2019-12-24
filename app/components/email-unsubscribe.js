import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { reads, empty, and, not } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { SECTION } from 'travis/controllers/account/settings';

const QUERY_PARAM_NAME = 'repository';

export default Component.extend({
  classNames: ['email-unsubscribe'],

  router: service(),
  store: service(),
  flashes: service(),
  auth: service(),

  isFirstAction: true,

  repositoryId: computed('router.currentURL', function () {
    let url = this.get('router.currentURL') || '';
    const queryParams = url.split('?')[1] || '';
    return queryParams.split('&').reduce((result, current = '') => {
      const [name, value] = current.split('=');
      return name === QUERY_PARAM_NAME ? value : result;
    }, '');
  }),

  repo: reads('fetchRepo.lastSuccessful.value'),
  isError: empty('repo'),
  isSubscribed: reads('repo.emailSubscribed'),
  isUnsubscribed: not('isSubscribed'),
  isSubscribing: and('isUnsubscribed', 'task.isRunning'),
  isUnsubscribing: and('isSubscribed', 'task.isRunning'),
  showConfigNote: and('isUnsubscribed', 'isFirstAction'),

  task: computed('isSubscribed', 'repo', function () {
    let isSubscribed = this.isSubscribed;
    let repo = this.repo;
    if (repo) {
      return isSubscribed ? repo.unsubscribe : repo.subscribe;
    }
  }),

  fetchRepo: task(function* () {
    let repo = null;
    try {
      repo = yield this.store.findRecord('repo', this.repositoryId);
    } catch (e) {}
    try {
      yield repo && repo.auth.currentUser._rawPermissions;
    } catch (e) {}

    return repo;
  }).drop(),

  didInsertElement() {
    this.flashes.clear();
    if (this.repositoryId) {
      this.fetchRepo.perform();
    } else {
      const queryParams = { section: SECTION.EMAIL };
      this.router.transitionTo('account.settings', this.auth.currentUser.login, { queryParams });
    }
    return this._super(...arguments);
  },

  willDestroyElement() {
    this.flashes.clear();
    return this._super(...arguments);
  },

  actions: {
    processTask() {
      const { isSubscribed } = this;

      this.flashes.clear();
      this.set('isFirstAction', false);

      this.task.perform()
        .then(() => {
          const action = isSubscribed ? 'unsubscribed' : 'subscribed';
          const message = `You have been ${action} successfully!`;
          this.flashes.success(message);
        })
        .catch(() => {
          const action = isSubscribed ? 'unsubscription' : 'subscription';
          const msg = `Something went wrong during the ${action} process. Please try again later.`;
          this.flashes.error(msg);
        });
    }
  }
});
