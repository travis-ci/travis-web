`import Ember from 'ember'`
`import Validations from 'travis/utils/validations'`

Controller = Ember.ObjectController.extend Validations,
  isEditing: false
  isSaving: false
  isDeleting: false
  defaultKey: null

  needs: ['repo']
  repo: Ember.computed.alias('controllers.repo.repo')

  validates:
    value: ['presence']

  reset: ->
    @set('isEditing', false)

  actions:
    add: ->
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
        @get('model').save().then =>
          @set('isEditing', false)
          @set('isSaving', false)
        , (error) =>
          @set('isSaving', false)
          if error.errors
            @addErrorsFromResponse(error.errors)
      else
        @set('isSaving', false)

    delete: ->
      return if @get('isDeleting')
      @set('isDeleting', true)

      deletingDone = => @set('isDeleting', false)

      @get('model').deleteRecord()
      @get('model').save().then(deletingDone, deletingDone).then =>
        @set('model', null)

    cancel: ->
      if model = @get('model')
        if model.get('currentState.stateName') == 'root.empty' ||
             model.get('currentState.stateName').indexOf('root.loaded.created') != -1
          @store.dematerializeRecord(model)

      @set('model', null)
      @set('isEditing', false)

    edit: ->
      @set('isEditing', true)

`export default Controller`
