`import TravisRoute from 'travis/routes/basic'`

Route = TravisRoute.extend
  renderTemplate: ->
    @render 'repo'
    @render 'build', into: 'repo'

  setupController: ->
    @_super.apply this, arguments

    @controllerFor('repo').activate('index')
    @controllerFor('repos').activate(@get('reposTabName'))

    @currentRepoDidChange()
    @controllerFor('repos').get('model').addObserver('firstObject', this, 'currentRepoDidChange')

  deactivate: ->
    @controllerFor('repos').get('model').removeObserver('firstObject', this, 'currentRepoDidChange')

    @_super.apply(this, arguments)

  currentRepoDidChange: ->
    if repo = @controllerFor('repos').get('model.firstObject')
      @controllerFor('repo').set('repo', repo)

  actions:
    redirectToGettingStarted: ->
      @transitionTo('getting_started')

`export default Route`
