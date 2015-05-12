`import Ember from 'ember'`
`import config from 'travis/config/environment'`

service = Ember.Service.extend
  pollingInterval: 30000
  ajaxPolling: true

  init: ->
    @_super.apply(this, arguments)

    @set('watchedModels', [])
    @set('sources', [])

    interval = setInterval =>
      return unless config.ajaxPolling
      @poll()
    , @get('pollingInterval')

    @set('interval', interval)

  willDestroy: ->
    @_super.apply(this, arguments)

    if interval = @get('interval')
      clearInterval(interval)

  startPollingHook: (source) ->
    sources = @get('sources')
    unless sources.contains(source)
      sources.pushObject(source)

  stopPollingHook: (source) ->
    sources = @get('sources')
    sources.removeObject(source)

  startPolling: (model) ->
    watchedModels = @get('watchedModels')
    unless watchedModels.contains(model)
      watchedModels.pushObject(model)

  stopPolling: (model) ->
    watchedModels = @get('watchedModels')
    watchedModels.removeObject(model)

  poll: ->
    @get('watchedModels').forEach (model) ->
      model.reload()

    @get('sources').forEach (source) =>
      if Ember.get(source, 'isDestroyed')
        @get('sources').removeObject(source)
      else
        source.pollHook()

`export default service`
