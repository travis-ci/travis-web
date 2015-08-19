`import Ember from 'ember'`
`import TravisRoute from 'travis/routes/basic'`
`import Ajax from 'travis/utils/ajax'`
`import config from 'travis/config/environment'`

Route = TravisRoute.extend
  deactivate: ->
    @controllerFor('loading').set('layoutName', null)

  model: (params) ->
    $.get(config.apiEndpoint + "/v3/owner/#{params.owner}")

  beforeModel: ->
    @controllerFor('loading').set('layoutName', 'simple')

    @_super.apply(this, arguments)

`export default Route`
