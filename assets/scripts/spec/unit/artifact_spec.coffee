store = null
record = null

describe 'Travis.Artifact', ->
  beforeEach ->
    store = Travis.Store.create()

  afterEach ->
    store.destroy()

  describe 'with part of the body loaded', ->
    beforeEach =>
      store.load Travis.Artifact, 1, { id: 1, body: 'first\nsecond\n' }
      record = store.find(Travis.Artifact, 1)

    it 'packs the existing part of the body to parts', ->
      expect( record.get('parts').toArray() ).toEqual( ['first\nsecond\n'] )

    it 'adds new chunks of log to parts', ->
      record.append('third\n')
      expect( record.get('parts').toArray() ).toEqual( ['first\nsecond\n', 'third\n'] )

    it 'properly handles array observers', ->
      called = 0
      observer = {
        arrayDidChange: -> called += 1
        arrayWillChange: -> called += 1
      }

      record.get('parts').addArrayObserver observer,
        willChange: 'arrayWillChange'
        didChange:  'arrayDidChange'

      record.append('something')

      expect(called).toEqual 2
