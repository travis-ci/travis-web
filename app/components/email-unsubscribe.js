import Component from '@ember/component';
import { service } from 'ember-decorators/service';
import { computed, action } from 'ember-decorators/object';
import { reads, empty, and, not } from 'ember-decorators/object/computed';
import { task } from 'ember-concurrency';

const QUERY_PARAM_NAME = 'repository';

export default Component.extend({
  classNames: ['email-unsubscribe'],

  @service router: null,
  @service store: null,
  @service flashes: null,

  @computed('router.currentURL')
  repositoryId(url = '') {
    const queryParams = url.split('?')[1] || '';
    return queryParams.split('&').reduce((result, current = '') => {
      const [name, value] = current.split('=');
      return name === QUERY_PARAM_NAME ? value : result;
    }, '');
  },

  @reads('fetchRepo.lastSuccessful.value')
  repo: null,

  @empty('repo')
  isError: false,

  @reads('repo.emailSubscribed')
  isSubscribed: false,

  @not('isSubscribed')
  isUnsubscribed: false,

  @and('isUnsubscribed', 'task.isRunning')
  isSubscribing: false,

  @and('isSubscribed', 'task.isRunning')
  isUnsubscribing: false,

  @computed('isSubscribed', 'repo')
  task(isSubscribed, repo) {
    if (repo) {
      return isSubscribed ? repo.unsubscribe : repo.subscribe;
    }
  },

  fetchRepo: task(function* () {
    const repo = yield this.store.findRecord('repo', this.repositoryId);
    return repo && repo.isCurrentUserACollaborator ? repo : null;
  }).drop(),

  didInsertElement() {
    this.flashes.clear();
    this.fetchRepo.perform();
    return this._super(...arguments);
  },

  willDestroyElement() {
    this.flashes.clear();
    return this._super(...arguments);
  },

  @action
  processTask() {
    const { isSubscribed } = this;

    this.flashes.clear();

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
});
