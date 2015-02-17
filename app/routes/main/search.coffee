`import MainTabRoute from 'travis/routes/main-tab'`

Route = MainTabRoute.extend
  renderTemplate: ->
    @render 'repo'
    @render 'build', into: 'repo'

  setupController: (controller, searchPhrase) ->
    # TODO: this method is almost the same as _super, refactor this
    @controllerFor('repo').activate('index')
    @controllerFor('repos').activate('search', searchPhrase)

    @currentRepoDidChange()
    @controllerFor('repos').addObserver('firstObject', this, 'currentRepoDidChange')

  model: (params) ->
    params.phrase.replace(/%2F/g, '/')

  deactivate: ->
    @_super.apply(this, arguments)

    @controllerFor('repos').set('search', undefined)

`export default Route`
