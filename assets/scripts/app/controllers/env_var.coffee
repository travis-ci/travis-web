require 'travis/validations'

Travis.EnvVarController = Ember.ObjectController.extend Travis.Validations,
  isEditing: false
  isDeleting: false

  validates:
    name: ['presence']

  actionType: 'Save'
  showValueField: Ember.computed.alias('public')

  value: ( (key, value) ->
    if arguments.length == 2
      @get('model').set('value', value)
      value
    else if @get('public')
      @get('model.value')
    else
      '••••••••••••••••'
  ).property('model.value')

  actions:
    delete: ->
      return if @get('isDeleting')
      @set('isDeleting', true)

      deletingDone = => @set('isDeleting', false)
      @get('model').deleteRecord().then deletingDone, deletingDone

    edit: ->
      @set('isEditing', true)

    cancel: ->
      @set('isEditing', false)
      @get('model').revert()

    save: ->
      return if @get('isSaving')
      @set('isSaving', true)

      if @isValid()
        env_var = @get('model')

        # TODO: handle errors
        env_var.save().then =>
          @set('isEditing', false)
          @set('isSaving', false)
        , =>
          @set('isSaving', false)
      else
        @set('isSaving', false)
