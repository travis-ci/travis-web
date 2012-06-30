Travis.Layout.Base = Em.Object.extend
  init: ->
    @parent = @get('parent')
    @setup(Array.prototype.slice.apply(arguments))
    @connect()

  setup: (controllers) ->
    $.extend this, Travis.Controllers
    $.extend this, Travis.Views

    for name in controllers.concat(@get('name'))
      key = "#{$.camelize(name, false)}Controller"
      name = $.camelize(key)
      klass = Travis.Controllers[name] || Em.Controller
      this[key] = klass.create(namespace: this, controllers: this)

  connect: ->
    @parent.connectOutlet
      outletName: 'layout'
      controller: @controller()
      viewClass: @viewClass()

  controller: ->
    this["#{$.camelize(@get('name'), false)}Controller"]

  viewClass: ->
    Travis.Views["#{$.camelize(@get('name'))}Layout"]
