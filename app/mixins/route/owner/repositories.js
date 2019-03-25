import Mixin from '@ember/object/mixin';
import { EVENTS } from 'travis/utils/dynamic-query';

const { PAGE_CHANGED } = EVENTS;

export default Mixin.create({
  owner: null,
  appsPage: 1,
  legacyPage: 1,

  queryParams: {
    'apps-page': {
      refreshModel: true
    },
    'legacy-page': {
      refreshModel: true
    }
  },

  model(params) {
    this.legacyPage = params['legacy-page'];
    this.appsPage = params['apps-page'];
  },

  afterModel() {
    const { owner } = this;
    if (owner && !owner.error) {
      owner.legacyRepositories.switchToPage(this.legacyPage);
      owner.githubAppsRepositories.switchToPage(this.appsPage);
    }
  },

  redirect() {
    const { owner } = this;
    if (owner && !owner.error) {
      this.owner.legacyRepositories.on(PAGE_CHANGED, page => {
        const queryParams = { 'legacy-page': page };
        this.transitionTo({ queryParams });
      });

      this.owner.githubAppsRepositories.on(PAGE_CHANGED, page => {
        const queryParams = { 'apps-page': page };
        this.transitionTo({ queryParams });
      });
    }
  },

  setupController(controller, model) {
    const { owner } = this;
    if (owner && !owner.error) {
      const { login } = owner;
      controller.setProperties({ owner, login });
    }
    return this._super(...arguments);
  }
});
