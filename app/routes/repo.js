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
    // this fetches data for the sidebar, so we do this in the setupController
    // hook to fetch data without blocking the UI
    this.controllerFor('repos').activate('owned');
    if (model && !model.get) {
      model = this.get('store').find('repo', model.id);
    }
    return controller.set('repo', model);
  },

  serialize(repo) {
    // slugs are sometimes unknown ???
    let slug = Ember.getWithDefault(repo, 'slug', 'unknown/unknown');
    let [ owner, name ] = slug.split('/');
    return { owner, name };
  },

  model(params) {
    console.log('repo route model');
    var slug;
    slug = params.owner + '/' + params.name;
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
