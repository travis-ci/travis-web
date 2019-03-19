import Mixin from '@ember/object/mixin';
import { hash } from 'rsvp';

export default Mixin.create({
  owner: null,

  model() {
    const { githubAppsRepositoriesOnOrg, webhooksRepositories } = this.owner;

    return hash({
      owner: this.owner,
      orgRepos: githubAppsRepositoriesOnOrg.load(),
      webhookRepos: webhooksRepositories.load()
    });
  },

  setupController(controller, model) {
    controller.setProperties(model);
  },

});

