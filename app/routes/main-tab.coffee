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
    if repos = @controllerFor('repos')
      repos.addObserver('repos.firstObject', this, 'currentRepoDidChange')

  deactivate: ->
    if repos = @controllerFor('repos')
      repos.removeObserver('repos.firstObject', this, 'currentRepoDidChange')

    @_super.apply(this, arguments)

  currentRepoDidChange: ->
    if repo = @controllerFor('repos').get('repos.firstObject')
      @controllerFor('repo').set('repo', repo)

  actions:
    redirectToGettingStarted: ->
      @transitionTo('getting_started')

`export default Route`
