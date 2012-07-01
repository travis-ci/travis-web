Travis.Layout.Base = Em.Object.extend
  init: ->
    @parent = @get('parent')
    @currentUser = Travis.app.currentUser

    @setup(Array.prototype.slice.apply(arguments).concat(@get('name')))
    @connect()

  setup: (controllers) ->
    $.extend this, Travis.Controllers
    $.extend this, Travis.Views

    # ember wants this kind of setup for its connectOutlets magic
    for name in controllers
      key = "#{$.camelize(name, false)}Controller"
      name = $.camelize(key)
      klass = Travis.Controllers[name] || Em.Controller
      this[key] = klass.create(namespace: this, controllers: this)

  connect: ->
    @parent.connectOutlet
      outletName: 'layout'
      controller: this["#{$.camelize(@get('name'), false)}Controller"]
      viewClass: Travis.Views["#{$.camelize(@get('name'))}Layout"]
