# `import Ember from 'ember'`

AddSshKeyComponent = Ember.Component.extend

  classNames: ['form--sshkey']
  classNameBindings: ['valueError:form-error']

  store: Ember.inject.service()
  isSaving: false

  didInsertElement: () ->
    id = @get('repo.id')
    model = @get('store').recordForId('sshKey', id)
    # TODO: this can be removed in favor of simply unloading record
    # once https://github.com/emberjs/data/pull/2867
    # and https://github.com/emberjs/data/pull/2870 are merged
    if model
      @get('store').dematerializeRecord(model)
      typeMap = @get('store').typeMapFor('sshKey')
      idToRecord = typeMap.idToRecord
      delete idToRecord[id]

    model = @get('store').createRecord('sshKey', id: id)
    @set('model', model)

  isValid: () ->
    if Ember.isBlank(@get('value'))
      this.set('valueError', 'Value can\'t be blank.')
      false
    else
      true

  reset: ->
    @setProperties(description: null, value: null)

  valueChanged: (->
    this.set('valueError', false)
  ).observes('value')

  addErrorsFromResponse: (errArr) ->
    error = errArr[0]
    if error.code == 'not_a_private_key'
      this.set('valueError', 'This key is not a private key.')
    else if error.code == 'key_with_a_passphrase'
      this.set('valueError', 'The key can\'t have a passphrase.')

  actions:

    save: ->
      this.set('valueError', false)
      return if @get('isSaving')
      @set('isSaving', true)
      if @isValid()

        ssh_key = @get('model').setProperties(
          description: @get('description')
          value: @get('value')
        )

        ssh_key.save().then =>
          @set('isSaving', false)
          @reset()

          @sendAction('sshKeyAdded', ssh_key)
        , (error) =>
          @set('isSaving', false)
          if error.errors
            @addErrorsFromResponse(error.errors)

      else
        @set('isSaving', false)

`export default AddSshKeyComponent`
