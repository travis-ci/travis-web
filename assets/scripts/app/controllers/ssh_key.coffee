Travis.SshKeyController = Ember.ObjectController.extend
  isEditing: false
  defaultKey: null

  needs: ['repoSettings']
  repo: Ember.computed.alias('controllers.repoSettings.model')

  actions:
    add: ->
      model = Travis.SshKey.create(id: @get('repo.id'))
      @set('model', model)
      @set('isEditing', true)

    save: ->
      @get('model').save().then =>
        @set('isEditing', false)

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
