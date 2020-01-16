import { getWithDefault, computed } from '@ember/object';
import TravisRoute from 'travis/routes/basic';
import Repo from 'travis/models/repo';
import ScrollResetMixin from 'travis/mixins/scroll-reset';
import { inject as service } from '@ember/service';
import { availableProviders, defaultVcsConfig } from 'travis/utils/vcs';

export default TravisRoute.extend(ScrollResetMixin, {
  store: service(),
  tabStates: service(),
  auth: service(),
  features: service(),

  onRunningTab: computed('features.showRunningJobsInSidebar', 'tabStates.sidebarTab', function () {
    let showRunningJobsInSidebar = this.get('features.showRunningJobsInSidebar');
    let sidebarTab = this.get('tabStates.sidebarTab');
    return showRunningJobsInSidebar && sidebarTab === 'running';
  }),

  activate(...args) {
    this._super(args);

    if (this.get('auth.signedIn')) {
      if (this.onRunningTab) {
        return;
      }
      if (!this.get('tabStates.sidebarTab', 'search')) {
        this.tabStates.set('sidebarTab', 'owned');
      }
      this.set('tabStates.mainTab', null);
    }
  },

  titleToken(model) {
    return model.get('slug');
  },

  setupController(controller, model) {
    if (model && !model.get) {
      model = this.store.find('repo', model.id);
    }
    return controller.set('repo', model);
  },

  serialize(repo) {
    // slugs are sometimes unknown ???
    const slug = getWithDefault(repo, 'slug', 'unknown/unknown');
    const [owner, name] = slug.split('/');
    const provider = repo.vcsProvider.prefix;

    return { provider, owner, name };
  },

  beforeModel(transition) {
    const { params, queryParams } = transition.to;
    let { provider, owner, name } = params;

    if (provider && !availableProviders.includes(provider)) {
      // If provider isn't one of the available providers,
      // then transition targets to one of the repository internal routes,
      // e.g. /travis-ci/travis-web/branches - it has the same signature (/:provider/:owner/:name)
      // so we're adding prefix here and redirecting to the proper route
      transition.abort();
      let internalRouteName;
      [internalRouteName, owner, name] = [name, provider, owner];
      this.transitionTo(internalRouteName, defaultVcsConfig.urlPrefix, owner, name, { queryParams });
    }
  },

  model({ provider, owner, name }) {
    const slug = `${owner}/${name}`;
    return Repo.fetchBySlug(this.store, slug, provider);
  },
});
