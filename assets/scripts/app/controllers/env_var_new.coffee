require 'travis/validations'

Travis.EnvVarsNewController = Travis.Controller.extend Travis.Validations,
  needs: ['repo']
  repo: Ember.computed.alias('controllers.repo.repo')

  validates:
    name: ['presence']

  actionType: 'Add'
  showValueField: true

  reset: ->
    @setProperties(name: null, value: null, public: null)

  actions:
    cancel: ->
      @reset()
      @transitionToRoute('env_vars')

    save: ->
      return if @get('isSaving')
      @set('isSaving', true)

      if @isValid()
        env_var = Travis.EnvVar.create(
          name: @get('name')
          value: @get('value')
          public: @get('public')
          repo: @get('repo')
        )

        self = this
        env_var.save().then =>
          @set('isSaving', false)
          @reset()
          self.transitionToRoute('env_vars')
        , =>
          @set('isSaving', false)
      else
        @set('isSaving', false)
