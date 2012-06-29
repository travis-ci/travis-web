Travis.Router = Em.Object.extend
  ROUTES:
    '!/profile':                     ['Profile', 'show']
    '!/:owner/:name/jobs/:id/:line': ['Default', 'job']
    '!/:owner/:name/jobs/:id':       ['Default', 'job']
    '!/:owner/:name/builds/:id':     ['Default', 'build']
    '!/:owner/:name/builds':         ['Default', 'builds']
    '!/:owner/:name/pull_requests':  ['Default', 'pullRequests']
    '!/:owner/:name/branch_summary': ['Default', 'branches']
    '!/:owner/:name':                ['Default', 'current']
    '':                              ['Default', 'index']

  init: ->
    @app = @get('app')

  start: ->
    @route(route, target[0], target[1]) for route, target of @ROUTES

  route: (route, layout, action) ->
    Em.routes.add route, (params) =>
      @action(layout, action, params)

  action: (layout, action, params) ->
    layout = Travis.Layout.instance(layout)
    layout["view#{$.camelize(action)}"](params)
