store = null
record = null

describe 'Travis.Build', ->
  beforeEach ->
    store = Travis.Store.create()

  afterEach ->
    store.destroy()

  describe 'incomplete attributes', ->
    beforeEach ->
      store.loadIncomplete Travis.Build, { id: 1, state: 'started' }
      record = store.find Travis.Build, 1

    it 'does not load record on duration, finishedAt and result if job is not in finished state', ->
      record.get('_duration')
      record.get('finishedAt')
      record.get('result')

      waits 50
      runs ->
        expect( record.get('incomplete') ).toBeTruthy()

    it 'loads the rest of the record if it\'s in finished state', ->
      store.loadIncomplete Travis.Build, { id: 1, state: 'passed' }
      record = store.find Travis.Build, 1
      record.get('finishedAt')

      waits 50
      runs ->
        expect( record.get('incomplete') ).toBeFalsy()
