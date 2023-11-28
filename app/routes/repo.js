import { computed } from '@ember/object';
import TravisRoute from 'travis/routes/basic';
import Repo from 'travis/models/repo';
import ScrollResetMixin from 'travis/mixins/scroll-reset';
import { inject as service } from '@ember/service';

export default TravisRoute.extend(ScrollResetMixin, {
  store: service(),
  tabStates: service(),
  auth: service(),
  features: service(),
  tasks: service(),

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
      return controller.set('repo', this.modelFor('repo'));
  },

  serialize(repo) {
    // slugs are sometimes unknown ???
    const slug = repo ? repo.get('slug') : 'unknown/unknown';
    const [owner, name] = (slug || 'unknown/unknown').split('/');
    const provider = repo.get('vcsProvider.urlPrefix');

    return { provider, owner, name };
  },

  model({ provider, owner, name, serverType }) {
    const slug = `${owner}/${name}`;
    this.set('slug', slug);
    return Repo.fetchBySlug(this.store, slug, provider, serverType);
  },

  beforeModel() {
    const repo = this.modelFor('repo');
    if (repo && !repo.repoOwnerAllowance) {
      this.tasks.fetchRepoOwnerAllowance.perform(repo);
    }
  },

  actions: {
    error(error) {
      error.slug = this.slug;
      return true;
    }
  }
});
