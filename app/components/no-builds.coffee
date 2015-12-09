`import Ember from 'ember'`
`import config from 'travis/config/environment'`

NoBuildsComponent = Ember.Component.extend
  actions:
    triggerBuild: () ->
      @set('isLoading', true)
      apiEndpoint = config.apiEndpoint
      $.ajax(apiEndpoint + "/v3/repo/#{@get('repo.repo.id')}/requests", {
        headers: {
          Authorization: 'token ' + @get('repo.auth')
        },
        type: "POST"
      }).then( =>
        @set('isLoading', false)
        # @transitionToRoute('repo')
      );

`export default NoBuildsComponent`
