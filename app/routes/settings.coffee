`import TravisRoute from 'travis/routes/basic'`
`import Ajax from 'travis/utils/ajax'`

Route = TravisRoute.extend
  needsAuth: true
  setupController: (controller, model) ->
    @_super.apply(this, arguments)
    controller.set('repo', @modelFor('repo'))
    @controllerFor('repo').activate('settings')

    controller.set('concurrentBuildsLimit', !!model.settings.maximum_number_of_builds)

  fetchEnvVars: () ->
    repo = @modelFor('repo')
    repo.get('envVars.promise')

  fetchCustomSshKey: () ->
    repo = @modelFor('repo')
    self = this
    @store.find('sshKey', repo.get('id')).then ( (result) -> result unless result.get('isNew') ), (xhr) ->
      if xhr.status == 404
        # if there is no model, just return null. I'm not sure if this is the
        # best answer, maybe we should just redirect to different route, like
        # ssh_key.new or ssh_key.no_key
        return false

  fetchSshKey: () ->
    repo = @modelFor('repo')
    Ajax.get "/repos/#{repo.get('id')}/key", (data) =>
      Ember.Object.create(fingerprint: data.fingerprint)

  model: () ->
    return Ember.RSVP.hash({
      settings: @modelFor('repo').fetchSettings(),
      envVars: this.fetchEnvVars(),
      sshKey: this.fetchSshKey(),
      customSshKey: this.fetchCustomSshKey()
    });

`export default Route`
