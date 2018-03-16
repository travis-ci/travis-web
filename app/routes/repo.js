import { getWithDefault } from '@ember/object';
import TravisRoute from 'travis/routes/basic';
import Repo from 'travis/models/repo';
import ScrollResetMixin from 'travis/mixins/scroll-reset';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';

export default TravisRoute.extend(ScrollResetMixin, {
  @service store: null,
  @service tabStates: null,
  @service repositories: null,
  @service auth: null,
  @service features: null,

  @computed('features.showRunningJobsInSidebar', 'tabStates.sidebarTab')
  onRunningTab(showRunningJobsInSidebar, sidebarTab) {
    return showRunningJobsInSidebar && sidebarTab === 'running';
  },

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
