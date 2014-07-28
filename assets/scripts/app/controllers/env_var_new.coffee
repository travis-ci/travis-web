Travis.EnvVarsNewController = Travis.Controller.extend
  needs: ['repoSettings']
  repo: Ember.computed.alias('controllers.repoSettings.model')

  actions:
    cancel: ->
      @transitionToRoute('env_vars')

    save: ->
      console.log(@get('repo.id'))
      env_var = Travis.EnvVar.create(
        name: @get('name')
        value: @get('value')
        public: @get('public')
        repo: @get('repo')
      )

      self = this
      env_var.save().then ->
        self.transitionToRoute('env_vars')
