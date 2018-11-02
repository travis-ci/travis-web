import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';
import { hash } from 'rsvp';
import { fetch } from 'fetch';
import $ from 'jquery';
import moment from 'moment';

export default TravisRoute.extend({
  @service auth: null,
  @service storage: null,

  needsAuth: false,

  queryParams: {
    page: {
      refreshModel: true
    },
    tab: {
      refreshModel: true
    },
  },

  @computed()
  recordsPerPage() {
    return config.pagination.profileReposPerPage;
  },

  model(params, transition) {
    if (typeof params.tab === 'string' && params.tab.toLowerCase() === 'insights') {
      let subTab = this.get('storage').getItem('travis.insight_tab') || 'month';
      let parentModel = this.modelFor('owner');

      let hashObject = {
        selectedTab: subTab,
        owner: parentModel,
      };
      return hash(hashObject);
    } else {
      let offset = (params.page - 1) * this.get('recordsPerPage');

      let queryParams = {
        offset,
        limit: this.get('recordsPerPage'),
        sort_by: 'default_branch.last_build:desc',
        custom: {
          owner: transition.params.owner.owner,
          type: 'byOwner',
        },
      };

      return this.store.paginated(
        'repo',
        queryParams,
        { live: false }
      );
    }
  },
});
