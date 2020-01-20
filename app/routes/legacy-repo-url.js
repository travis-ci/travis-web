import Route from '@ember/routing/route';
import { vcsConfigByUrlPrefix, defaultVcsConfig } from 'travis/utils/vcs';
import { isEmpty } from '@ember/utils';

export default Route.extend({
  beforeModel(transition) {
    transition.abort();
    const { params, queryParams } = transition.to;
    let { owner, repo, method, id, view } = params;
    let provider, routeName = 'provider', routeModels = [];

    const vcsConfig = vcsConfigByUrlPrefix(owner);

    const isLegacyUrl = isEmpty(vcsConfig);
    if (isLegacyUrl) {
      provider = defaultVcsConfig.urlPrefix;
    } else {
      // params include provider, so swap them accordingly
      [provider, owner, repo, method, id] = [owner, repo, method, id, view];
    }

    routeModels.push(provider);

    if (owner) {
      routeName = 'owner';
      routeModels.push(owner);
    }
    if (repo) {
      routeName = 'repo';
      routeModels.push(repo);
    }
    if (method) {
      routeName = method;
    }
    if (id) {
      routeName = method.singularize();
      routeModels.push(id);
    }
    if (view) {
      routeName = `${routeName}.${view}`;
    }

    this.transitionTo(routeName, ...routeModels, { queryParams });
  }
});
