require 'utils/validations'

Validations = Travis.Validations
EnvVar = Travis.EnvVar

Controller = Ember.Controller.extend Validations,
  needs: ['repo']
  repo: Ember.computed.alias('controllers.repo.repo')

  isSaving: false

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
        env_var = @store.createRecord('env_var',
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

Travis.EnvVarsNewController = Controller
