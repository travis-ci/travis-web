import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { assert } from '@ember/debug';
import { computed } from '@ember/object';
import { filter, sort } from '@ember/object/computed';
import config from 'travis/config/environment';
import dynamicQuery from 'travis/utils/dynamic-query';

const { repoBuildsPerPage: limit } = config.pagination;
const MAIN_EVENT_TYPES = ['push', 'api', 'cron'];
const SORT_PROPS = ['number:desc'];

export default Component.extend({
  store: service(),

  repoId: null,
  missingNotice: 'No builds for this repository',

  sortProps: computed(() => SORT_PROPS),
  eventTypes: computed({
    get() { return MAIN_EVENT_TYPES; },
    set(key, val) { return typeof val === 'string' ? [val] : val; },
  }),

  fetchBuilds({ page }) {
    const { eventTypes, repoId, store } = this;
    const offset = (page - 1) * limit;

    return store.paginated('build', {
      repository_id: repoId,
      event_type: eventTypes,
      limit, offset
    }, { live: false });
  },

  buildsLoader: dynamicQuery(function* ({ page = 1 }) {
    return yield this.fetchBuilds({ page, eventType: 'pull_request' });
  }, {
    appendResults: true,
    limitPagination: true,
    limit,
  }),

  filteredBuilds: filter('_builds', function (build) {
    return build.get('repo.id') === this.repoId && this.eventTypes.includes(build.eventType);
  }),

  builds: sort('filteredBuilds', 'sortProps'),


  init() {
    this.set('_builds', this.store.peekAll('build'));
    return this._super(...arguments);
  },

  didReceiveAttrs() {
    this._super(...arguments);
    assert('RepoBuildList requires @repoId', !!this.repoId);
  },
});
