import TravisRoute from 'travis/routes/basic';
import Repo from 'travis/models/repo';
import ScrollResetMixin from 'travis/mixins/scroll-reset';
import Ember from 'ember';

const { service } = Ember.inject;

export default TravisRoute.extend(ScrollResetMixin, {
  store: service(),

  titleToken(model) {
    return model.get('slug');
  },

  renderTemplate() {
    return this.render('repo', {
      into: 'main'
    });
  },

  setupController(controller, model) {
    this.controllerFor('repos').activate('owned');
    if (model && !model.get) {
      model = this.get('store').find('repo', model.id);
    }
    return controller.set('repo', model);
  },

  serialize(repo) {
    var name, owner, ref, slug;
    slug = repo.get ? repo.get('slug') : repo.slug;
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
    slug = params.owner + "/" + params.name;
    return Repo.fetchBySlug(this.get('store'), slug);
  },

  resetController() {
    return this.controllerFor('repo').deactivate();
  },

  actions: {
    error(error) {
      if (error.slug) {
        // if error thrown has a slug (ie. it was probably repo not found)
        // set the slug on main.error controller to allow to properly
        // display the repo information
        this.controllerFor('main.error').set('slug', error.slug);
      }
      return true;
    }
  }
});
