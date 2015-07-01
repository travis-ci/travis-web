`import Ember from 'ember'`

EnvVarComponent = Ember.Component.extend

  classNames: ['settings-envvar']

  name:   DS.attr()
  value:  DS.attr()
  public: DS.attr('boolean')

  repo: DS.belongsTo('repo', async: true)

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
  ).property('model.value', 'public')

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
