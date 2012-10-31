store = null
record = null

describe 'Travis.Build', ->
  beforeEach ->
    store = Travis.Store.create()

  afterEach ->
    store.destroy()

  describe 'incomplete attributes', ->
    beforeEach ->
      record = store.loadIncomplete Travis.Build, { id: 1, state: 'started' }

    it 'does not load record on duration, finishedAt and result if job is not in finished state', ->
      record.get('_duration')
      record.get('finishedAt')
      record.get('result')

      waits 50
      runs ->
        expect( record.get('complete') ).toBeFalsy()

    it 'loads the rest of the record if it\'s in finished state', ->
      record = store.loadIncomplete Travis.Build, { id: 1, state: 'finished' }
      record.get('finishedAt')

      waits 50
      runs ->
        expect( record.get('complete') ).toBeTruthy()
