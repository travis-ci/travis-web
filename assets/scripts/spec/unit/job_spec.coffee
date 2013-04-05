store = null
record = null

describe 'Travis.Job', ->
  beforeEach ->
    store = Travis.Store.create()

  afterEach ->
    store.destroy()

  describe 'configKeys', ->
    it 'takes into account the keys of other jobs', ->
      buildConfig = { rvm: ['1.9.3', '2.0.0'] }
      store.load Travis.Build, { id: '1', job_ids: ['1', '2', '3'], config: buildConfig }, { id: '1' }

      store.load Travis.Job, { id: '1', config: { rvm: '1.9.3', env: 'FOO=foo'       }, build_id: '1' }, { id: '1' }
      store.load Travis.Job, { id: '2', config: { rvm: '2.0.0', gemfile: 'Gemfile.1' },  build_id: '1' }, { id: '2' }
      store.load Travis.Job, { id: '3', config: { rvm: '1.9.3', jdk: 'OpenJDK'       },  build_id: '1' }, { id: '3' }

      job1 = store.find(Travis.Job, '1')
      job2 = store.find(Travis.Job, '2')
      job3 = store.find(Travis.Job, '3')

      expect( job1.get('configValues') ).toEqual( [ '1.9.3', 'FOO=foo', undefined, undefined ] )
      expect( job2.get('configValues') ).toEqual( [ '2.0.0', undefined, 'Gemfile.1', undefined ] )
      expect( job3.get('configValues') ).toEqual( [ '1.9.3', undefined, undefined, 'OpenJDK' ] )

  describe 'incomplete attributes', ->
    beforeEach ->
      store.loadIncomplete Travis.Job, { id: 1, state: 'started' }
      record = store.find Travis.Job, 1

    it 'does not load record on duration, finishedAt and result if job is not in finished state', ->
      record.get('_duration')
      record.get('finishedAt')
      record.get('result')

      waits 50
      runs ->
        expect( record.get('incomplete') ).toBeTruthy()

    it 'loads the rest of the record if it\'s in finished state', ->
      store.loadIncomplete Travis.Job, { id: 1, state: 'passed' }
      record = store.find Travis.Job, 1
      record.get('finishedAt')

      waits 50
      runs ->
        expect( record.get('incomplete') ).toBeFalsy()


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
