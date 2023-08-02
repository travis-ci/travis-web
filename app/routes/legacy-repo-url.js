import Route from '@ember/routing/route';
import { vcsConfigByUrlPrefix, defaultVcsConfig } from 'travis/utils/vcs';
import { isEmpty } from '@ember/utils';

export default Route.extend({
  templateName: 'error404',

  beforeModel(transition) {
    const { params, queryParams } = transition.to;
    let { owner, repo, method, id, view, provider, serverType } = params;
    let vcsConfig, routeName = 'provider', routeModels = [];

    if (provider) {
      vcsConfig = vcsConfigByUrlPrefix(provider);
    } else {
      vcsConfig = vcsConfigByUrlPrefix(owner);
    }

    const isLegacyUrl = isEmpty(vcsConfig);
    const serverTypes = ['git', 'svn', 'perforce'];
    const isServerTypeUrl = serverTypes.includes(serverType) || serverTypes.includes(id);

    if (isLegacyUrl) {
      provider = defaultVcsConfig.urlPrefix;
    } else {
      // params include provider, so swap them accordingly
      if (!isServerTypeUrl) {
        [provider, owner, repo, method, id] = [owner, repo, method, id, view];
      } else if (serverTypes.includes(id)) {
        [provider, owner, repo, serverType, method, id, view] = [owner, repo, method, id, view];
      }
    }

    const newQueryParams = { serverType: serverType, ...queryParams };

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

    if (this._router.hasRoute(routeName)) {
      transition.abort();
      this.transitionTo(routeName, ...routeModels, { queryParams: newQueryParams });
    }
  }
});
