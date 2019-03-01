import Mixin from '@ember/object/mixin';

export default Mixin.create({
  account: null,
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
    const { account } = this;
    account.legacyRepositories.switchToPage(this.legacyPage);
    account.githubAppsRepositories.switchToPage(this.appsPage);
  },

  setupController(controller, model) {
    const account = this.account;
    if (!account.error) {
      const { login } = account;
      controller.setProperties({ account, login });
    }
    return this._super(...arguments);
  }
});
