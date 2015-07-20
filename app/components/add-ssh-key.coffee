`import Ember from 'ember'`

AddSshKeyComponent = Ember.Component.extend

  classNames: ['form--sshkey']

  store: Ember.inject.service()
  isSaving: false

  isValid: () ->
    true

  reset: ->
    @setProperties(description: null, value: null)

  actions: 

    add: ->
      # not sure how to integrate that with 'save' in the compotent
      id = @get('repo.id')
      model = @store.recordForId('sshKey', id)
      # TODO: this can be removed in favor of simply unloading record
      # once https://github.com/emberjs/data/pull/2867
      # and https://github.com/emberjs/data/pull/2870 are merged
      if model
        @store.dematerializeRecord(model)
        typeMap = @store.typeMapFor('sshKey')
        idToRecord = typeMap.idToRecord
        delete idToRecord[id]

      model = @store.createRecord('sshKey', id: id)
      @set('model', model)
      @set('isEditing', true)

    save: ->
      return if @get('isSaving')
      @set('isSaving', true)

      if @isValid()

        ssh_key = @get('store').createRecord('ssh_key',
          description: @get('description')
          value: @get('value')
          fingerprint: 'I dont know?'
          repo: @get('repo')
        )
        self = this
        ssh_key.save().then =>
          @set('isSaving', false)
          @reset()
        , =>
          @set('isSaving', false)

        # if error.errors
        #   @addErrorsFromResponse(error.errors)
      else
        @set('isSaving', false)

`export default AddSshKeyComponent`
