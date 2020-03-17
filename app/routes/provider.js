import Route from '@ember/routing/route';
import { vcsConfigByUrlPrefix, defaultVcsConfig } from 'travis/utils/vcs';

export default Route.extend({
  beforeModel(transition) {
    const { params, queryParams } = transition.to;
    const { provider } = params;
    if (vcsConfigByUrlPrefix(provider)) {
      this.transitionTo('index'); // redirect to home page if accessing provider route directly
    } else {
      // Legacy owner page
      const owner = provider;
      this.transitionTo('owner', defaultVcsConfig.urlPrefix, owner, { queryParams });
    }
  }
});
