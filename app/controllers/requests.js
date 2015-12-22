import Ember from 'ember';

export default Ember.ArrayController.extend({
  repoController: Ember.inject.controller('repo'),

  lintUrl: function() {
    var slug;
    slug = this.get('repoController.repo.slug');
    return "https://lint.travis-ci.org/" + slug;
  }.property('repoController.repo.slug')
});
