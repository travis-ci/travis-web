`import Ember from 'ember'`

EnvVarComponent = Ember.Component.extend

  classNames: ['settings-envvar']
  classNameBindings: ['envVar.public:is-public']

  isEditing: false
  isDeleting: false

  validates:
    name: ['presence']

  actionType: 'Save'
  showValueField: Ember.computed.alias('public')

  value: ( (key, value) ->
    if @get('envVar.public')
      @get('envVar.value')
    else
      '••••••••••••••••'
  ).property('envVar.value', 'envVar.public')

  actions:
    delete: ->
      return if @get('isDeleting')
      @set('isDeleting', true)

      @get('model').destroyRecord()

    edit: ->
      @set('isEditing', true)

    cancel: ->
      @set('isEditing', false)
      @get('model').revert()

    save: ->
      return if @get('isSaving')

      if @isValid()
        env_var = @get('model')

        # TODO: handle errors
        env_var.save().then =>
          @set('isEditing', false)

`export default EnvVarComponent`
