require 'travis/validations'

Travis.SshKeyController = Ember.ObjectController.extend Travis.Validations,
  isEditing: false
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
      if @isValid()
        @get('model').save().then =>
          @set('isEditing', false)
        , (xhr) =>
          if xhr.status == 422
            @addErrorsFromResponse(JSON.parse(xhr.response)['errors'])

    delete: ->
      @get('model').deleteRecord().then =>
        @set('model', null)

    cancel: ->
      if model = @get('model')
        if model.get('isNew')
          @set('model', null)
        @set('isEditing', false)

    edit: ->
      @set('isEditing', true)
