import Ember from 'ember';

const { controller } = Ember.inject;

export default Ember.Controller.extend({
  repoController: controller('repo'),

  lintUrl: function() {
    var slug;
    slug = this.get('repoController.repo.slug');
    return "https://lint.travis-ci.org/" + slug;
  }.property('repoController.repo.slug')
});
