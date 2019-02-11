import { getWithDefault, computed } from '@ember/object';
import TravisRoute from 'travis/routes/basic';
import Repo from 'travis/models/repo';
import ScrollResetMixin from 'travis/mixins/scroll-reset';
import { inject as service } from '@ember/service';

export default TravisRoute.extend(ScrollResetMixin, {
  store: service(),
  tabStates: service(),
  repositories: service(),
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
      if (this.get('onRunningTab')) {
        return;
      }
      if (!this.get('tabStates.sidebarTab', 'search')) {
        this.get('tabStates').set('sidebarTab', 'owned');
      }
      this.set('tabStates.mainTab', null);
    }
  },

  titleToken(model) {
    return model.get('slug');
  },

  setupController(controller, model) {
    if (model && !model.get) {
      model = this.get('store').find('repo', model.id);
    }
    return controller.set('repo', model);
  },

  serialize(repo) {
    // slugs are sometimes unknown ???
    const slug = getWithDefault(repo, 'slug', 'unknown/unknown');
    const [owner, name] = slug.split('/');

    return {
      owner: owner,
      name: name
    };
  },

  model(params) {
    const { name, owner } = params;
    const slug = `${owner}/${name}`;
    return Repo.fetchBySlug(this.get('store'), slug);
  },
});
