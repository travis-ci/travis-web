import Component from '@ember/component';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';
import { reads, empty } from 'ember-decorators/object/computed';
import { task } from 'ember-concurrency';

const QUERY_PARAM_NAME = 'repository';

export default Component.extend({
  classNames: ['email-unsubscribe'],
  @service router: null,
  @service store: null,

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

  fetchRepo: task(function* () {
    const repo = yield this.store.findRecord('repo', this.repositoryId);
    return repo && repo.isCurrentUserACollaborator ? repo : null;
  }).restartable(),

  didInsertElement() {
    this.fetchRepo.perform();
    return this._super(...arguments);
  }
});
