import { getWithDefault } from '@ember/object';
import TravisRoute from 'travis/routes/basic';
import ScrollResetMixin from 'travis/mixins/scroll-reset';
import { inject as service } from '@ember/service';
import { and } from '@ember/object/computed';

export default TravisRoute.extend(ScrollResetMixin, {
  store: service(),
  tabStates: service(),
  auth: service(),
  features: service(),

  slug: null,

  isOnRunningTab: and('features.showRunningJobsInSidebar', 'tabStates.isSidebarRunning'),

  titleToken: repo => repo.get('slug'),

  serialize(repo) {
    // slugs are sometimes unknown ???
    const slug = getWithDefault(repo, 'slug', 'unknown/unknown');
    const [owner, name] = slug.split('/');
    const provider = repo.get('vcsProvider.urlPrefix');

    return { provider, owner, name };
  },

  model({ provider, owner, name }) {
    const { store } = this;
    const slug = `${owner}/${name}`;
    this.set('slug', slug);
    return store.peekAll('repo').findBy('slug', slug) || store.queryRecord('repo', { slug, provider });
  },

  activate() {
    if (this.auth.signedIn && !this.tabStates.isSidebarSearch && !this.onRunningTab) {
      this.tabStates.switchSidebarToOwned();
    }
    this._super(...arguments);
  },

  actions: {
    error(error) {
      error.slug = this.slug;
      return true;
    }
  }
});
