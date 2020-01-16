import Route from '@ember/routing/route';
import { defaultVcsConfig } from 'travis/utils/vcs';

export default Route.extend({
  beforeModel(transition) {
    transition.abort();
    const { params, queryParams } = transition.to;
    const { owner, name } = params;
    const { urlPrefix } = defaultVcsConfig;
    this.transitionTo('repo', urlPrefix, owner, name, { queryParams });
  }
});
