`import TravisRoute from 'travis/routes/basic'`

Route = TravisRoute.extend
  titleToken: (model) ->
    @get('contentType').replace('_', ' ').capitalize()

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

`export default Route`
