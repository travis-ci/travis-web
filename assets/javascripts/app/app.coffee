require 'travis' # hrm.
require 'controllers'
require 'helpers'
require 'models'
require 'pusher'
require 'routes'
require 'store'
require 'templates'
require 'views'

require 'config/locales'
require 'data/sponsors'

# $.mockjaxSettings.log = false
# Ember.LOG_BINDINGS = true
# Ember.ENV.RAISE_ON_DEPRECATION = true
# Pusher.log = -> console.log(arguments)

Travis.reopen
  App: Em.Application.extend
    USER_PAYLOAD:
      user: { id: 1, login: 'svenfuchs', name: 'Sven Fuchs', email: 'me@svenfuchs.com', token: '1234567890', gravatar: '402602a60e500e85f2f5dc1ff3648ecb', locale: 'en', repo_count: 2, synced_at: '2012-09-15T20:53:14Z' }
      accounts: [{ login: 'travis-ci', name: 'Travis CI', type: 'org', repoCounts: 1 }]

    init: ->
      @_super()
      @connect()

      @store = Travis.Store.create()
      @store.loadMany(Travis.Sponsor, Travis.SPONSORS)

      @routes = new Travis.Routes()
      @pusher = new Travis.Pusher()

      @setCurrentUser(JSON.parse($.cookie('user')))

    signIn: ->
      # Travis.Auth.signIn()
      @setCurrentUser(@USER_PAYLOAD)
      @render.apply(this, @get('returnTo') || ['home', 'index'])

    signOut: ->
      @setCurrentUser()

    setCurrentUser: (data) ->
      data = JSON.parse(data) if typeof data == 'string'
      $.cookie('user', JSON.stringify(data))
      if data
        @store.load(Travis.User, data.user)
        @store.loadMany(Travis.Account, data.accounts)
      @set('currentUser', if data then Travis.User.find(data.user.id) else undefined)

    render: (name, action, params) ->
      layout = @connectLayout(name)
      layout.activate(action, params || {})
      $('body').attr('id', name)

    receive: ->
      @store.receive.apply(@store, arguments)

    connectLayout: (name) ->
      unless @get('layout.name') == name
        name = $.camelize(name)
        viewClass = Travis["#{name}Layout"]
        @layout = Travis["#{name}Controller"].create(parent: @controller)
        @controller.connectOutlet(outletName: 'layout', controller: @layout, viewClass: viewClass)
      @layout

    connect: ->
      @controller = Em.Controller.create()
      view = Em.View.create
        template: Em.Handlebars.compile('{{outlet layout}}')
        controller: @controller
      view.appendTo(@get('rootElement') || 'body')

    toggleSidebar: ->
      $('body').toggleClass('maximized')
      # TODO gotta force redraws here :/
      element = $('<span></span>')
      $('#top .profile').append(element)
      Em.run.later (-> element.remove()), 10
      element = $('<span></span>')
      $('#repository').append(element)
      Em.run.later (-> element.remove()), 10

