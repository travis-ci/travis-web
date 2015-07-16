`import Ember from 'ember'`

EnvVarComponent = Ember.Component.extend

  classNames: ['settings-envvar']
  classNameBindings: ['envVar.public:is-public']

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
      @get('envVar').destroyRecord()

`export default EnvVarComponent`
