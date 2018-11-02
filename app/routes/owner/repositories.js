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

      // FIXME get a token the real way, unless v3 proxy work finishes first
      let insightToken = this.get('storage').getItem('travis.insight_token') || '';
      let insightEndpoint = 'https://travis-insights-production.herokuapp.com';
      let endTime = moment();
      let startTime = moment().subtract(1, 'week');

      // let headers = new Headers({
      //   'authorization': `Token token="${insightToken}"`
      // });
      let insightParams = $.param({
        subject: 'builds',
        interval: '1day',
        func: 'sum',
        name: 'count_started',
        owner_type: parentModel['@type'] === 'user' ? 'User' : 'Organization',
        owner_id: parentModel.id,
        token: insightToken,
        end_time: endTime.format('YYYY-MM-DD HH:mm:ss UTC'),
        start_time: startTime.format('YYYY-MM-DD HH:mm:ss UTC'),
      });
      let url = `${insightEndpoint}/metrics?${insightParams}`;

      let hashObject = {
        selectedTab: subTab,
        insight: fetch(url).then(response => {
          if (response.ok) {
            return response.json();
          } else { return false; }
        })
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

  actions: {
    setSubTab(selection) {
      this.get('storage').setItem('travis.insight_tab', selection);
      this.refresh();
    }
  }
});
