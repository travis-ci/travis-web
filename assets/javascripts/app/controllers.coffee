require 'helpers'
require 'travis/ticker'

Travis.reopen
  Controller: Em.Controller.extend
    init: ->
      for name in Array.prototype.slice.apply(arguments)
        name = "#{$.camelize(name, false)}Controller"
        klass = Travis[$.camelize(name)] || Em.Controller
        this[name] = klass.create(parent: this,  namespace: Travis, controllers: this)

    connectTop: ->
      @connectOutlet(outletName: 'top', controller: @topController, viewClass: Travis.TopView)
      @topController.set('tab', @get('name'))

    connectOutlet: ->
      view = @_super.apply(this, arguments)

      if view
        _connectedOutletViews = Travis.app.get('_connectedOutletViews')
        unless _connectedOutletViews
          _connectedOutletViews = []

        _connectedOutletViews.pushObject(view)
        Travis.app.set('_connectedOutletViews', _connectedOutletViews)

      view

  TopController: Em.Controller.extend
    userBinding: 'Travis.app.currentUser'

require 'controllers/auth'
require 'controllers/builds'
require 'controllers/home'
require 'controllers/owners'
require 'controllers/profile'
require 'controllers/repositories'
require 'controllers/repository'
require 'controllers/sidebar'
require 'controllers/stats'
