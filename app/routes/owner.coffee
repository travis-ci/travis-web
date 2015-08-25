`import Ember from 'ember'`
`import TravisRoute from 'travis/routes/basic'`
`import Ajax from 'travis/utils/ajax'`
`import config from 'travis/config/environment'`

Route = TravisRoute.extend

  deactivate: ->
    @controllerFor('loading').set('layoutName', null)

  model: (params) ->
    if @get('auth.signedIn')
      $.get(config.apiEndpoint + "/v3/owner/#{params.owner}", {
        headers: {
          Authorization: "token #{@auth.token()}"
        }
      })
    else
      $.get(config.apiEndpoint + "/v3/owner/#{params.owner}")

  beforeModel: ->
    @controllerFor('loading').set('layoutName', 'simple')

    @_super.apply(this, arguments)

`export default Route`
