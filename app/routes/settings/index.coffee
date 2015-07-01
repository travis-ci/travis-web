`import TravisRoute from 'travis/routes/basic'`

Route = TravisRoute.extend
  titleToken: 'Settings'

  model: ->
    repo = @modelFor('repo')
    console.log('######### YEHA ###############')
    repo.fetchSettings().then (settings) ->

      console.log(settings)
      repo.set('settings', settings)

    # return Ember.RSVP.hash({
    #   settings: repo.fetchSettings(),
    #   envVars: repo.envVars(),
    #   sshKey: repo.sshKey()
    # })

`export default Route`
