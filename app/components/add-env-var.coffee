`import Ember from 'ember'`

AddEnvVarComponent = Ember.Component.extend

  classNames: ['form--envvar']

  store: Ember.inject.service()

  isValid: () ->
    true

  reset: ->
    @setProperties(name: null, value: null, public: null)

  actions:
    save: ->
      return if @get('isSaving')
      @set('isSaving', true)

      if @isValid()
        env_var = @get('store').createRecord('env_var',
          name: @get('name')
          value: @get('value')
          public: @get('public')
          repo: @get('repo')
        )

        self = this
        env_var.save().then =>
          @set('isSaving', false)
          @reset()
        , =>
          @set('isSaving', false)
      else
        @set('isSaving', false)


`export default AddEnvVarComponent`
