Travis.Routes = ->
  unless Travis.Routes.initialized
    Em.routes.set('usesHistory', true)
    Em.routes.set('wantsHistory', true)
    Em.routes.set('baseURI', @base_uri)

    @add(route, target[0], target[1]) for route, target of Travis.ROUTES
    Travis.Routes.initialized = true

$.extend Travis.Routes.prototype,
  base_uri: "#{document.location.protocol}//#{document.location.host}"

  add: (route, layout, action) ->
    Em.routes.add route, (params) =>
      @action(layout, action, params)

  route: (event) ->
    Em.routes.set('location', $(event.target).closest('a')[0].href.replace("#{@base_uri}/", ''))

  action: (name, action, params) ->
    # this needs to be a global reference because Em.routes is global
    Travis.app.render(name, action, params) if @before(name, action, params)

  before: (name, action, params) ->
    if @requiresAuth(name, action, params)
      true
    else
      @requireAuth(name, action, params)

  signedIn: ->
    !!Travis.app.get('currentUser')

  requiresAuth: (name, action, params) ->
    name != 'profile' || @signedIn()

  requireAuth: (name, action, params) ->
    Travis.app.set('returnTo', [name, action, params])
    Travis.app.render('auth', 'show')
    false
