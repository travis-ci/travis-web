Travis.Routes = Em.Object.extend
  BASE_URI: 'http://localhost:9292'

  ROUTES:
    'profile':                     ['profile', 'show']
    'stats':                       ['stats', 'show']
    ':owner/:name/jobs/:id/:line': ['home', 'job']
    ':owner/:name/jobs/:id':       ['home', 'job']
    ':owner/:name/builds/:id':     ['home', 'build']
    ':owner/:name/builds':         ['home', 'builds']
    ':owner/:name/pull_requests':  ['home', 'pullRequests']
    ':owner/:name/branches':       ['home', 'branches']
    ':owner/:name':                ['home', 'current']
    '':                            ['home', 'index']

  start: ->
    unless @started
      Em.routes.set('usesHistory', true)
      Em.routes.set('wantsHistory', true)
      Em.routes.set('baseURI', @BASE_URI)

      @started = true
      @add(route, target[0], target[1]) for route, target of @ROUTES

  add: (route, layout, action) ->
    Em.routes.add route, (params) =>
      @action(layout, action, params)

  route: (event) ->
    Em.routes.set('location', event.target.href.replace("#{@BASE_URI}/", ''))

  action: (name, action, params) ->
    # this needs to be a global reference because Em.routes is global
    layout = Travis.app.connectLayout(name)
    layout.activate(action, params || {})
    $('body').attr('id', name)
