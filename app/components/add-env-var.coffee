`import Ember from 'ember'`

AddEnvVarComponent = Ember.Component.extend

  classNames: ['form--envvar']

  store: Ember.inject.service()

  isValid: () ->
    if Ember.isBlank(@get('name'))
      this.set('nameIsBlank', true)
      false
    else
      true

  reset: ->
    @setProperties(name: null, value: null, public: null)

  actions:
    save: ->
      console.log('SUBMITTED')
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

    nameChanged: ->
      this.set('nameIsBlank', false)


`export default AddEnvVarComponent`
