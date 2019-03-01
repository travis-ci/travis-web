import Mixin from '@ember/object/mixin';
import { hash } from 'rsvp';

export default Mixin.create({
  account: null,

  model() {
    const { githubAppsRepositoriesOnOrg, webhooksRepositories } = this.account;

    return hash({
      owner: this.account,
      orgRepos: githubAppsRepositoriesOnOrg.load(),
      webhookRepos: webhooksRepositories.load()
    });
  },

  setupController(controller, model) {
    controller.setProperties(model);
  },

});

