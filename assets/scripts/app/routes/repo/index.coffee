require 'routes/basic'

TravisRoute = Travis.BasicRoute

Route = TravisRoute.extend
  setupController: (controller, model) ->
    @_super.apply this, arguments
    @controllerFor('repo').activate('current')

  renderTemplate: ->
    if @modelFor('repo').get('lastBuildId')
      @render 'build'
    else
      @render 'builds/not_found'

  deactivate: ->
    repo = @controllerFor('repo')
    @controllerFor('build').set('build', null)
    @controllerFor('job').set('job', null)

Travis.RepoIndexRoute = Route
