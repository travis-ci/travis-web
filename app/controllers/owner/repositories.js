import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { and, equal, bool } from '@ember/object/computed';
import { DEFAULT_INSIGHTS_INTERVAL } from 'travis/services/insights';

export const OWNER_TABS = {
  REPOSITORIES: 'repositories',
  INSIGHTS: 'insights',
  CUSTOM_IMAGES: 'custom-images',
};

export default Controller.extend({
  queryParams: ['page', 'tab', 'timeInterval'],

  features: service(),
  auth: service(),

  isLoading: false,
  page: 1,
  tab: OWNER_TABS.INSIGHTS,
  requestPrivateInsights: true,

  timeInterval: DEFAULT_INSIGHTS_INTERVAL,
  defaultTimeInterval: DEFAULT_INSIGHTS_INTERVAL,

  isInsights: equal('tab', OWNER_TABS.INSIGHTS),
  isCustomImages: equal('tab', OWNER_TABS.CUSTOM_IMAGES),
  isPrivateInsightsViewable: and('features.proVersion', 'builds.value.private'),
  includePrivateInsights: and('isPrivateInsightsViewable', 'requestPrivateInsights'),
  canViewCustomImages: computed(function() {
    if(this.model.owner.isUser) {
      return this.model.owner.id == this.auth.currentUser.id;
    } else {
      let membership = this.auth.currentUser.memberships.find((memb) => memb.organization_id == this.model.owner.id);
      return membership.build_permission;
    }
  }),

  repos: null,
  reposLoading: equal('repos', null),

  builds: null,
  buildsReady: bool('builds.isFinished'),


  actions: {
    setRequestPrivateInsights(val) {
      this.set('requestPrivateInsights', val);
    },
  },
});
