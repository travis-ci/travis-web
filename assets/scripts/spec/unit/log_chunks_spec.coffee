module "Travis.LogChunks"

test "it doesn't trigger downloading missing parts if they come in timely fashion", ->
  expect(2)
  stop()

  callback = -> ok false, 'callback should not be called'

  chunks = Travis.LogChunks.create(timeout: 15, missingPartsCallback: callback, content: [])

  setTimeout (-> chunks.pushObject(number: 1, final: false)), 10
  setTimeout (-> chunks.pushObject(number: 2, final: false)), 20
  setTimeout ->
    ok true
    chunks.pushObject(number: 3, final: true)
    start()

    equal(chunks.get('finalized'), true, 'log should be finalized')
  , 30

test "it triggers downloading missing parts if there is a missing part, even though final part arrived", ->
  expect(2)
  stop()

  callback = (missingNumbers) ->
    deepEqual(missingNumbers, [2, 3], 'callback should be called with missing numbers')

  chunks = Travis.LogChunks.create(timeout: 15, missingPartsCallback: callback, content: [])

  chunks.pushObject(number: 1, final: false)
  setTimeout ->
    chunks.pushObject(number: 4, final: true)

    ok(!chunks.get('finalized'), "log shouldn't be finalized")
  , 10

  setTimeout ->
    Ember.run -> chunks.destroy() # destroy object to not fire more callbacks
    start()
  , 40

test "it triggers downloading next parts if there is no final part", ->
  expect(4)
  stop()

  callback = (missingNumbers, after) ->
    deepEqual(missingNumbers, [2], 'callback should be called with missing numbers')
    equal(after, 3, 'callback should be called with "after" argument')

  chunks = Travis.LogChunks.create(timeout: 15, missingPartsCallback: callback, content: [])

  chunks.pushObject(number: 1, final: false)
  chunks.pushObject(number: 3, final: false)

  setTimeout ->
    Ember.run -> chunks.destroy() # destroy object to not fire more callbacks
    start()
  , 35

test "it triggers downloading all available parts if there is no parts yet", ->
  expect(2)
  stop()

  callback = (missingNumbers, after) ->
    ok(!missingNumbers, 'there should be no missing parts')
    ok(!after, 'after should not be specified')

  chunks = Travis.LogChunks.create(timeout: 15, missingPartsCallback: callback, content: [])

  setTimeout ->
    Ember.run -> chunks.destroy() # destroy object to not fire more callbacks
    start()
  , 25
