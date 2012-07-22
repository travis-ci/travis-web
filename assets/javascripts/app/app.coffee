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
Ember.ENV.RAISE_ON_DEPRECATION = true
# Pusher.log = -> console.log(arguments)

Travis.reopen
  App: Em.Application.extend
    init: ->
      @_super()
      @connect()

      @store = Travis.Store.create()
      @store.loadMany(Travis.Sponsor, Travis.SPONSORS)

      @routes = new Travis.Routes()
      # @pusher = new Travis.Pusher()

    connect: ->
      @controller = Em.Controller.create()
      view = Em.View.create
        template: Em.Handlebars.compile('{{outlet layout}}')
        controller: @controller
      view.appendTo(@get('rootElement') || 'body')

    connectLayout: (name) ->
      unless @get('layout.name') == name
        name = $.camelize(name)
        viewClass = Travis["#{name}Layout"]
        @layout = Travis["#{name}Controller"].create(parent: @controller)
        @controller.connectOutlet(outletName: 'layout', controller: @layout, viewClass: viewClass)
      @layout


