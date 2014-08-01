require 'travis/validations'

Travis.SshKeyController = Ember.ObjectController.extend Travis.Validations,
  isEditing: false
  isSaving: false
  isDeleting: false
  defaultKey: null

  needs: ['repo']
  repo: Ember.computed.alias('controllers.repo.repo')

  validates:
    value: ['presence']

  actions:
    add: ->
      model = Travis.SshKey.create(id: @get('repo.id'))
      @set('model', model)
      @set('isEditing', true)

    save: ->
      return if @get('isSaving')
      @set('isSaving', true)

      if @isValid()
        @get('model').save().then =>
          @set('isEditing', false)
          @set('isSaving', false)
        , (xhr) =>
          @set('isSaving', false)
          if xhr.status == 422
            @addErrorsFromResponse(JSON.parse(xhr.response)['errors'])
      else
        @set('isSaving', false)

    delete: ->
      return if @get('isDeleting')
      @set('isDeleting', true)

      deletingDone = => @set('isDeleting', false)
      @get('model').deleteRecord().then(deletingDone, deletingDone).then =>
        @set('model', null)

    cancel: ->
      if model = @get('model')
        if model.get('isNew')
          @set('model', null)
        @set('isEditing', false)

    edit: ->
      @set('isEditing', true)
