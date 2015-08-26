`import Ember from 'ember'`
`import TravisRoute from 'travis/routes/basic'`
`import Ajax from 'travis/utils/ajax'`
`import config from 'travis/config/environment'`

Route = TravisRoute.extend

  deactivate: ->
    @controllerFor('loading').set('layoutName', null)

  model: (params) ->
    options = {}
    if @get('auth.signedIn')
      options.headers = { Authorization: "token #{@auth.token()}" }
    $.ajax(config.apiEndpoint + "/v3/owner/#{params.owner}", options)

  beforeModel: ->
    @controllerFor('loading').set('layoutName', 'simple')

    @_super.apply(this, arguments)

`export default Route`
