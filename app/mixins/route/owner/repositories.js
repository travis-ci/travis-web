import Mixin from '@ember/object/mixin';

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

  setupController(controller, model) {
    const { owner } = this;
    if (owner && !owner.error) {
      const { login } = owner;
      controller.setProperties({ owner, login });
    }
    return this._super(...arguments);
  }
});
