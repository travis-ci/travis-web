`import Ember from 'ember'`

Controller = Ember.ArrayController.extend
  repoController: Ember.inject.controller('repo')

  lintUrl: (->
    slug = @get('repoController.repo.slug')
    "https://lint.travis-ci.org/#{slug}"
  ).property('repoController.repo.slug')

`export default Controller`
