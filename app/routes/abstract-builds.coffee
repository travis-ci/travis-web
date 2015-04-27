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
    @controllerFor('build').set('contentType', @get('contentType'))

  deactivate: ->
    @controllerFor('repo').removeObserver(@get('path'), this, 'contentDidChange')

    @_super.apply(this, arguments)

  contentDidChange: ->
    path = @get('path')
    @controllerFor('builds').set('model', @controllerFor('repo').get(path))

  path: (->
    type = @get('contentType')
    "repo.#{type.camelize()}"
  ).property('contentType')

`export default Route`
