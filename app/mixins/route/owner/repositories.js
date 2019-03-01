import Mixin from '@ember/object/mixin';

export default Mixin.create({
  account: null,
  appsPage: 1,
  legacyPage: 1,

  queryParams: {
    'appsPage': {
      refreshModel: true
    },
    'legacyPage': {
      refreshModel: true
    }
  },

  model(params) {
    this.legacyPage = params['legacyPage'];
    this.appsPage = params['appsPage'];
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
