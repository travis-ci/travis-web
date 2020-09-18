import { getWithDefault, computed } from '@ember/object';
import TravisRoute from 'travis/routes/basic';
import Repo from 'travis/models/repo';
import ScrollResetMixin from 'travis/mixins/scroll-reset';
import { inject as service } from '@ember/service';

export default TravisRoute.extend(ScrollResetMixin, {
  store: service(),
  tabStates: service(),
  auth: service(),
  features: service(),

  slug: null,

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
    const provider = repo.get('vcsProvider.urlPrefix');

    return { provider, owner, name };
  },

  model({ provider, owner, name }) {
    const slug = `${owner}/${name}`;
    this.set('slug', slug);
    return Repo.fetchBySlug(this.store, slug, provider);
  },

  beforeModel() {
    const repo = this.modelFor('repo');
    if (repo && !repo.repoOwnerAllowance) {
      repo.fetchRepoOwnerAllowance.perform();
    }
  },

  actions: {
    error(error) {
      error.slug = this.slug;
      return true;
    }
  }
});
