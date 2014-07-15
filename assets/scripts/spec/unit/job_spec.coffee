record = null

module "Travis.Job",
  setup: ->
  teardown: ->
    Travis.Job.resetData()
    Travis.Build.resetData()

test 'configKeys takes into account the keys of other jobs', ->
  buildConfig = { rvm: ['1.9.3', '2.0.0'] }
  Travis.Build.load [{ id: '1', job_ids: ['1', '2', '3'], config: buildConfig }]

  Travis.Job.load [{ id: '1', config: { rvm: '1.9.3', env: 'FOO=foo'       }, build_id: '1' }]
  Travis.Job.load [{ id: '2', config: { rvm: '2.0.0', gemfile: 'Gemfile.1' },  build_id: '1' }]
  Travis.Job.load [{ id: '3', config: { rvm: '1.9.3', jdk: 'OpenJDK'       },  build_id: '1' }]

  configValues1 = null
  configValues2 = null
  configValues3 = null
  job1 = null
  job2 = null
  job3 = null

  Ember.run ->
    job1 = Travis.Job.find('1')
    job2 = Travis.Job.find('2')
    job3 = Travis.Job.find('3')

  wait().then ->
    Ember.run ->
      configValues1 = job1.get('configValues')
      configValues2 = job2.get('configValues')
      configValues3 = job3.get('configValues')

    deepEqual( configValues1, [ '1.9.3', 'FOO=foo', undefined, undefined ] )
    deepEqual( configValues2, [ '2.0.0', undefined, 'Gemfile.1', undefined ] )
    deepEqual( configValues3, [ '1.9.3', undefined, undefined, 'OpenJDK' ] )

test 'it does not load record on duration, finishedAt and result if job is not in finished state', ->
  Travis.Job.load [{ id: 1, state: 'started', started_at: null }]

  Ember.run ->
    record = Travis.Job.find 1

    record.loadTheRest = ->
      ok(false, 'loadTheRest should not be called')

    record.get('_duration')
    record.get('finishedAt')
    record.get('result')

  wait().then ->
    ok(true, 'loadTheRest was not called')

test 'it loads record on duration, finishedAt and result if job is in finished state', ->
  expect(1)

  Travis.Job.load [{ id: 1, state: 'passed', started_at: null }]

  Ember.run ->
    record = Travis.Job.find 1

    record.loadTheRest = ->
      ok(true, 'loadTheRest should be called')

    record.get('finishedAt')

  wait()

test 'returns config values for all keys available on build with different number of config keys in sibling jobs', ->
  buildAttrs =
    id: 1
    job_ids: [1, 2]
    config:
      jdk: ['oraclejdk7']
      rvm: ['jruby-head']

  Travis.Build.load [buildAttrs]

  jobAttrs =
    id: 1
    build_id: 1
    config:
      jdk: 'oraclejdk7'
      rvm: 'jruby-head'

  Travis.Job.load [jobAttrs]

  jobAttrs =
    id: 2
    build_id: 1
    config:
      jdk: null
      rvm: 'jruby-head'

  Travis.Job.load [jobAttrs]

  configValues1 = null
  configValues2 = null
  job1 = null
  job2 = null

  Ember.run ->
    job1 = Travis.Job.find(1)
    job2 = Travis.Job.find(2)

  wait().then ->
    Ember.run ->
      configValues1 = job1.get('configValues')
      configValues2 = job2.get('configValues')

    deepEqual( configValues1, ['oraclejdk7', 'jruby-head'] )
    deepEqual( configValues2, [undefined,    'jruby-head'] )
