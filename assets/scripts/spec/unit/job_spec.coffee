store = null
record = null

describe 'Travis.Job', ->
  beforeEach ->
    store = Travis.Store.create()

  afterEach ->
    store.destroy()

  describe 'incomplete attributes', ->
    beforeEach ->
      record = store.loadIncomplete Travis.Job, { id: 1, state: 'started' }

    it 'does not load record on duration, finishedAt and result if job is not in finished state', ->
      record.get('_duration')
      record.get('finishedAt')
      record.get('result')

      waits 50
      runs ->
        expect( record.get('complete') ).toBeFalsy()

    it 'loads the rest of the record if it\'s in finished state', ->
      record = store.loadIncomplete Travis.Job, { id: 1, state: 'finished' }
      record.get('finishedAt')

      waits 50
      runs ->
        expect( record.get('complete') ).toBeTruthy()


  describe 'with different number of config keys in sibling jobs', ->
    beforeEach ->
      buildAttrs =
        id: 1
        job_ids: [1, 2]
        config:
          jdk: ['oraclejdk7']
          rvm: ['jruby-head']

      store.load Travis.Build, 1, buildAttrs

      jobAttrs =
        id: 1
        build_id: 1
        config:
          jdk: 'oraclejdk7'
          rvm: 'jruby-head'

      store.load Travis.Job, 1, jobAttrs

      jobAttrs =
        id: 2
        build_id: 1
        config:
          jdk: null
          rvm: 'jruby-head'

      store.load Travis.Job, 2, jobAttrs

    it 'returns config values for all keys available on build', ->
      job1 = store.find Travis.Job, 1
      job2 = store.find Travis.Job, 2

      expect( job1.get('configValues') ).toEqual ['oraclejdk7', 'jruby-head']
      expect( job2.get('configValues') ).toEqual [undefined,    'jruby-head']
