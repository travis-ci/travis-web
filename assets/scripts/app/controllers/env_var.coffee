Travis.EnvVarController = Ember.ObjectController.extend
  isEditing: false

  value: ( (key, value) ->
    if arguments.length == 2
      @get('model').set('value', value)
      value
    else if @get('public')
      @get('model.value')
    else
      '****************'
  ).property('model.value')

  actions:
    delete: ->
      @get('model').deleteRecord()

    edit: ->
      @set('isEditing', true)

    cancel: ->
      @set('isEditing', false)
      @get('model').revert()

    save: ->
      env_var = @get('model')

      # TODO: handle errors
      env_var.save().then =>
        @set('isEditing', false)
