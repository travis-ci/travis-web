import Mixin from '@ember/object/mixin';
import { hash } from 'rsvp';

export default Mixin.create({

  account: null,

  model() {
    const { githubAppsRepositoriesOnOrg, webhooksRepositories } = this.account;

    return hash({
      owner: this.account,
      orgRepos: githubAppsRepositoriesOnOrg.promise,
      webhookRepos: webhooksRepositories.promise
    });
  },

  setupController(controller, model) {
    controller.setProperties(model);
  },

});

