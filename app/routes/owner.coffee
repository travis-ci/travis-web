`import Ember from 'ember'`
`import TravisRoute from 'travis/routes/basic'`
`import config from 'travis/config/environment'`

Route = TravisRoute.extend
  deactivate: ->
    @controllerFor('loading').set('layoutName', null)

  model: (params) ->
    options = {}
    if @get('auth.signedIn')
      options.headers = { Authorization: "token #{@auth.token()}" }
    $.ajax(config.apiEndpoint + "/v3/owner/#{params.owner}?include=organization.repositories,repository.default_branch,build.commit", options)

  beforeModel: ->
    @controllerFor('loading').set('layoutName', 'simple')

    @_super.apply(this, arguments)

  actions:
    error: (error, transition, originRoute) ->
      login = transition.params.owner.owner

      message = if error.status == 404
        @transitionTo('error404')
      else
        "There was an error while loading data, please try again."

      @controllerFor('error').set('layoutName', 'simple')
      @controllerFor('error').set('message', message)

      return true

`export default Route`
