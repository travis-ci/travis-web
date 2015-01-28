require 'routes/route'

TravisRoute = Travis.Route

Route = TravisRoute.extend
  renderTemplate: ->
    @render 'builds'

  setupController: ->
    @controllerFor('repo').activate(@get('contentType'))
    @contentDidChange()
    @controllerFor('repo').addObserver(@get('path'), this, 'contentDidChange')

  deactivate: ->
    @controllerFor('repo').removeObserver(@get('path'), this, 'contentDidChange')

  contentDidChange: ->
    path = @get('path')
    @controllerFor('builds').set('model', @controllerFor('repo').get(path))

  path: (->
    type = @get('contentType')
    "repo.#{type.camelize()}"
  ).property('contentType')

Travis.AbstractBuildsRoute = Route
