`import TravisRoute from 'travis/routes/basic'`

Route = TravisRoute.extend
  renderTemplate: ->
    @render 'repo'
    @render 'build', into: 'repo'

  setupController: ->
    @_super.apply this, arguments

    @controllerFor('repo').activate('index')
    @controllerFor('repos').activate(@get('reposTabName'))

    @setCurrentRepoObservers()

  deactivate: ->
    if repos = @controllerFor('repos')
      repos.removeObserver('repos.firstObject', this, 'currentRepoDidChange')

    @_super.apply(this, arguments)

  currentRepoDidChange: ->
    if repo = @controllerFor('repos').get('repos.firstObject')
      @controllerFor('repo').set('repo', repo)

  setCurrentRepoObservers: ->
    @currentRepoDidChange()
    if repos = @controllerFor('repos')
      repos.addObserver('repos.firstObject', this, 'currentRepoDidChange')

  actions:
    redirectToGettingStarted: ->
      @transitionTo('getting_started')

`export default Route`
