Travis.Router = Em.Object.extend
  ROUTES:
    '!/profile':                     ['profile', 'show']
    '!/stats':                       ['stats', 'show']
    '!/:owner/:name/jobs/:id/:line': ['home', 'job']
    '!/:owner/:name/jobs/:id':       ['home', 'job']
    '!/:owner/:name/builds/:id':     ['home', 'build']
    '!/:owner/:name/builds':         ['home', 'builds']
    '!/:owner/:name/pull_requests':  ['home', 'pullRequests']
    '!/:owner/:name/branch_summary': ['home', 'branches']
    '!/:owner/:name':                ['home', 'current']
    '':                              ['home', 'index']

  init: ->
    @app = @get('app')

  start: ->
    @route(route, target[0], target[1]) for route, target of @ROUTES

  route: (route, layout, action) ->
    Em.routes.add route, (params) =>
      @action(layout, action, params)

  action: (name, action, params) ->
    layout = Travis.Layout.instance(name, @app.controller)
    layout.activate(action, params)
    $('body').attr('id', name)
