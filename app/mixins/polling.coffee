`import Ember from 'ember'`
`import config from 'travis/config/environment'`

mixin = Ember.Mixin.create
  polling: Ember.inject.service()

  didInsertElement: ->
    @_super.apply(this, arguments)

    return unless config.ajaxPolling
    @startPolling()

  willDestroyElement: ->
    @_super.apply(this, arguments)

    return unless config.ajaxPolling
    @stopPolling()

  pollModelDidChange: (sender, key, value) ->
    @pollModel(key)

  pollModelWillChange: (sender, key, value) ->
    @stopPollingModel(key)

  pollModel: (property) ->
    addToPolling = (model) =>
      @get('polling').startPolling(model)

    if model = @get(property)
      if model.then
        model.then (resolved) ->
          addToPolling(resolved)
      else
        addToPolling(model)

  stopPollingModel: (property) ->
    if model = @get(property)
      @get('polling').stopPolling(model)

  startPolling: ->
    pollModels = @get('pollModels')

    if pollModels
      pollModels = [pollModels] unless Ember.isArray(pollModels)

      pollModels.forEach (property) =>
        @pollModel(property)
        @addObserver(property, this, 'pollModelDidChange')
        Ember.addBeforeObserver(this, property, this, 'pollModelWillChange')

    @get('polling').startPollingHook(this) if @pollHook

  stopPolling: ->
    if pollModels = @get('pollModels') 
      pollModels = [pollModels] unless Ember.isArray(pollModels)

      pollModels.forEach (property) =>
        @stopPollingModel(property)
        @removeObserver(property, this, 'pollModelDidChange')
        Ember.removeBeforeObserver(this, property, this, 'pollModelWillChange')

    @get('polling').stopPollingHook(this)

`export default mixin`
