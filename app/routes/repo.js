import TravisRoute from 'travis/routes/basic';
import Repo from 'travis/models/repo';
import ScrollResetMixin from 'travis/mixins/scroll-reset';
import Ember from 'ember';

const { service } = Ember.inject;

export default TravisRoute.extend(ScrollResetMixin, {
  store: service(),
  tabStates: service(),

  titleToken(model) {
    return model.get('slug');
  },

  renderTemplate(...args) {
    this._super(args);
    return this.render('repos', {
      outlet: 'left',
      into: 'repo'
    });
  },

  setupController(controller, model) {
    this.controllerFor('repos').activate(this.get('tabStates.sidebarTab'));
    if (model && !model.get) {
      model = this.get('store').find('repo', model.id);
    }
    return controller.set('repo', model);
  },

  serialize(repo) {
    var name, owner, ref, slug;
    // slugs are sometimes unknown ???
    slug = Ember.getWithDefault(repo, 'slug', 'unknown/unknown');
    ref = slug.split('/');
    owner = ref[0];
    name = ref[1];

    return {
      owner: owner,
      name: name
    };
  },

  model(params) {
    var slug;
    slug = params.owner + '/' + params.name;
    return Repo.fetchBySlug(this.get('store'), slug);
  },

  resetController() {
    return this.controllerFor('repo').deactivate();
  },
});
