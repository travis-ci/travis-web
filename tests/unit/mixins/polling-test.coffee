`import { test, moduleForComponent } from 'ember-qunit'`
`import Polling from 'travis/mixins/polling'`

hookRuns = 0
pollingChangesHistory = []

# define component just for testing
define('travis/components/polling-test', [], ->
  PollingService = Ember.Object.extend(
    startPolling: (model) ->
      pollingChangesHistory.push(type: 'start', model: model)

    stopPolling: (model) ->
      pollingChangesHistory.push(type: 'stop', model: model)

    startPollingHook: (source) ->
      pollingChangesHistory.push(type: 'start-hook', source: source+'')

    stopPollingHook: (source) ->
      pollingChangesHistory.push(type: 'stop-hook', source: source+'')
  )

  Ember.Component.extend(Polling,
    init: ->
      @_super.apply this, arguments

      @set('polling', PollingService.create())

    pollModels: ['model1', 'model2'],
    pollHook: ->
      hookRuns += 1

    toString: ->
      '<PollingTestingComponent>'
  )
)


# I want to test this mixin in context of component, so I'm using
# modelForComponent
moduleForComponent 'polling-test', 'PollingTestComponent', {
  # specify the other units that are required for this test
  needs: []

  setup: ->
    hookRuns = 0
    pollingChangesHistory = []
}

test 'it properly stops polling hook without any models', ->
  component = @subject(pollModels: null)
  @append()

  Ember.run ->
    component.destroy()

  expected = [
    { type: 'start-hook', source: '<PollingTestingComponent>' },
    { type: 'stop-hook', source: '<PollingTestingComponent>' }
  ]

  deepEqual pollingChangesHistory, expected


test 'it works even if one of the model is null', ->
  component = @subject(model1: { name: 'model1' })
  @append()

  Ember.run ->
    component.destroy()

  expected = [
    { type: 'start', model: { name: 'model1' } },
    { type: 'start-hook', source: '<PollingTestingComponent>' }
    { type: 'stop', model: { name: 'model1' } },
    { type: 'stop-hook', source: '<PollingTestingComponent>' }
  ]

  deepEqual pollingChangesHistory, expected

test 'it polls for both models if they are present', ->
  component = @subject(model1: { name: 'model1' }, model2: { name: 'model2' })
  @append()

  Ember.run ->
    component.destroy()

  expected = [
    { type: 'start', model: { name: 'model1' } },
    { type: 'start', model: { name: 'model2' } },
    { type: 'start-hook', source: '<PollingTestingComponent>' }
    { type: 'stop', model: { name: 'model1' } },
    { type: 'stop', model: { name: 'model2' } },
    { type: 'stop-hook', source: '<PollingTestingComponent>' }
  ]

  deepEqual pollingChangesHistory, expected

test 'it detects model changes', ->
  component = @subject(model1: { name: 'foo' })
  @append()

  Ember.run ->
    component.set('model1', { name: 'bar' })

  Ember.run ->
    component.destroy()

  expected = [
    { type: 'start', model: { name: 'foo' } },
    { type: 'start-hook', source: '<PollingTestingComponent>' }
    { type: 'stop', model:  { name: 'foo' } },
    { type: 'start', model: { name: 'bar' } },
    { type: 'stop', model:  { name: 'bar' } },
    { type: 'stop-hook', source: '<PollingTestingComponent>' }
  ]

  deepEqual pollingChangesHistory, expected


