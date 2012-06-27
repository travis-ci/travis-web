Travis.Router = Em.Object.extend
  ROUTES:
    '!/:owner/:name/jobs/:id/:line': 'job'
    '!/:owner/:name/jobs/:id':       'job'
    '!/:owner/:name/builds/:id':     'build'
    '!/:owner/:name/builds':         'builds'
    '!/:owner/:name/pull_requests':  'pullRequests'
    '!/:owner/:name/branch_summary': 'branches'
    '!/:owner/:name':                'current'
    '':                              'index'

  init: () ->
    @app = @get('app')

  start: ->
    @app.connectLayout()
    @app.connectLeft(Travis.Repository.find())
    @route(route, action) for route, action of @ROUTES

  route: (route, tab) ->
    Em.routes.add(route, (params) => this[tab](params))

  index: (params) ->
    repositories = @app.get('repositories')
    onceLoaded repositories, =>
      repository = repositories.get('firstObject')
      @app.connectRepository(repository)
      @app.connectTabs()
      @app.connectBuild(repository.get('lastBuild'))

  current: (params) ->
    @repository params, (repository) =>
      @app.connectTabs()
      @app.connectBuild(repository.get('lastBuild'))

  builds: (params) ->
    @repository params, (repository) =>
      @app.connectTabs()
      @app.connectBuilds(repository.get('builds'))

  build: (params) ->
    @repository params
    @buildBy params.id, (build) =>
      @app.connectTabs(build)
      @app.connectBuild(build)

  job: (params) ->
    @repository params
    @jobBy params.id, (job) =>
      @app.connectTabs(job.get('build'), job)
      @app.connectJob(job)

  repository: (params, callback) ->
    @repositoryBy params, (repository) =>
      @app.connectRepository(repository)
      callback(repository) if callback

  repositoryBy: (params, callback) ->
    repositories = Travis.Repository.bySlug("#{params.owner}/#{params.name}")
    onceLoaded repositories, =>
      callback(repositories.get('firstObject'))

  buildBy: (id, callback) =>
    build = Travis.Build.find(id)
    onceLoaded build, =>
      callback(build)

  jobBy: (id, callback) ->
    job = Travis.Job.find(id)
    onceLoaded job, =>
      callback(job)
