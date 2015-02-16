`import Ember from 'ember'`

Controller = Ember.ArrayController.extend
  needs: ['repo']
  repo: Ember.computed.alias('controllers.repo.repo')

  lintUrl: (->
    slug = @get('repo.slug')
    "https://lint.travis-ci.org/#{slug}"
  ).property('repo.slug')

`export default Controller`
