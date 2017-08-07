import TravisRoute from 'travis/routes/basic';
import Repo from 'travis/models/repo';
import ScrollResetMixin from 'travis/mixins/scroll-reset';
import Ember from 'ember';
import { service } from 'ember-decorators/service';

export default TravisRoute.extend(ScrollResetMixin, {
  @service store: null,
  @service tabStates: null,
  @service repositories: null,

  activate(...args) {
    this._super(args);

    if (this.get('auth.signedIn')) {
      if (this.get('features.proVersion') && this.get('tabStates.sidebarTab') === 'running') {
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
    const slug = Ember.getWithDefault(repo, 'slug', 'unknown/unknown');
    const [owner, name] = slug.split('/');

    return {
      owner: owner,
      name: name
    };
  },

  model(params) {
    const slug = params.owner + '/' + params.name;
    return Repo.fetchBySlug(this.get('store'), slug);
  },
});
