`import { test, moduleForComponent } from 'ember-qunit'`

server = null
moduleForComponent 'travis-status', 'TravisStatusComponent', {}

test 'adds incident class to .status-circle', ->
  expect 3
  # creates the component instance
  component = @subject()
  component.getStatus = ->
    new Ember.RSVP.Promise (resolve, reject) ->
      resolve({ status: { indicator: 'major' } })

  ok !component.get('status'), 'status is initially not set'

  @append()

  equal component.get('status'), 'major', 'status is updated from the API'
  ok component.$('.status-circle').hasClass('major'), 'status class is set on .status-circle'
