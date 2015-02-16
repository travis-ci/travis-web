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
    @controllerFor('repos').addObserver('firstObject', this, 'currentRepoDidChange')

  deactivate: ->
    @controllerFor('repos').removeObserver('firstObject', this, 'currentRepoDidChange')

  currentRepoDidChange: ->
    if repo = @controllerFor('repos').get('firstObject')
      @controllerFor('repo').set('repo', repo)

  actions:
    redirectToGettingStarted: ->
      @transitionTo('getting_started')

`export default Route`
