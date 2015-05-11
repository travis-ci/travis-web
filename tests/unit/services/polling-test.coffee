`import Ember from 'ember'`
`import Polling from 'travis/services/polling'`

service = null

module 'PollingService',
  teardown: ->
    unless service.get('isDestroyed')
      Ember.run ->
        service.destroy()

test 'polls for each of the models', ->
  expect(3)

  history = []

  service = Polling.create(
    pollingInterval: 20
  )

  model1 = {
    reload: ->
      ok(true)
      history.push 'model1'
  }

  model2 = {
    reload: ->
      ok(true)
      history.push 'model2'
  }

  service.startPolling(model1)
  service.startPolling(model2)

  stop()

  setTimeout ->
    start()

    deepEqual history, ['model1', 'model2']

    Ember.run ->
      service.destroy()
  , 30

test 'it will stop running any reloads after it is destroyed', ->
  expect(1)

  service = Polling.create(
    pollingInterval: 20
  )

  model = {
    reload: ->
      ok(true)
  }

  service.startPolling(model)

  stop()

  setTimeout ->
    Ember.run ->
      service.destroy()
  , 30

  setTimeout ->
    start()
  , 50

test 'it stops reloading models after they were removed from polling', ->
  expect(4)

  history = []

  service = Polling.create(
    pollingInterval: 30
  )

  model1 = {
    reload: ->
      ok(true)
      history.push 'model1'
  }

  model2 = {
    reload: ->
      ok(true)
      history.push 'model2'
  }

  service.startPolling(model1)
  service.startPolling(model2)

  stop()

  setTimeout ->
    service.stopPolling(model2)

    setTimeout ->
      Ember.run ->
        service.destroy()

      start()

      deepEqual history, ['model1', 'model2', 'model1']
    , 30
  , 40

test 'it runs a hook on each interval', ->
  expect(1)

  history = []

  service = Polling.create(
    pollingInterval: 20
  )

  source = {
    pollHook: ->
      ok(true)
  }

  service.startPollingHook(source)

  stop()

  setTimeout ->
    service.stopPollingHook(source)

    setTimeout ->
      Ember.run ->
        service.destroy()

      start()
    , 10
  , 30

test 'it will not run pollHook if the source is destroyed', ->
  expect(1)

  history = []

  service = Polling.create(
    pollingInterval: 20
  )

  source = Ember.Object.extend(
    pollHook: ->
      ok(true)
  ).create()

  service.startPollingHook(source)

  stop()

  setTimeout ->
    Ember.run ->
      source.destroy()

    setTimeout ->
      Ember.run ->
        service.destroy()

      start()
    , 35
  , 30
