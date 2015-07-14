`import TravisRoute from 'travis/routes/basic'`

Route = TravisRoute.extend
  needsAuth: true
  setupController: (controller, model) ->
    @_super.apply(this, arguments)
    controller.set('repo', @modelFor('repo'))
    @controllerFor('repo').activate('settings')

  fetchEnvVars: () ->
    repo = @modelFor('repo')
    repo.get('envVars.promise')

  model: () ->
    return Ember.RSVP.hash({
      envVars: this.fetchEnvVars(),
      # sshKey: this.fetchSshKey()
    });

`export default Route`
