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

  describe 'configKeys', ->
    it 'takes into account all the jobs when getting config keys', ->
      buildConfig = { rvm: ['1.9.3', '2.0.0'] }
      store.load Travis.Build, { id: '1', job_ids: ['1', '2', '3'], config: buildConfig }, { id: '1' }

      store.load Travis.Job, { id: '1', config: { rvm: '1.9.3', env: 'FOO=foo'       } }, { id: '1' }
      store.load Travis.Job, { id: '2', config: { rvm: '2.0.0', gemfile: 'Gemfile.1' } }, { id: '2' }
      store.load Travis.Job, { id: '3', config: { rvm: '1.9.3', jdk: 'OpenJDK'       } }, { id: '3' }

      build = store.find(Travis.Build, '1')

      expect( build.get('rawConfigKeys') ).toEqual( ['rvm', 'env', 'gemfile', 'jdk' ] )
      expect( build.get('configKeys') ).toEqual( [ 'Job', 'Duration', 'Finished', 'Rvm', 'Env', 'Gemfile', 'Jdk' ] )
