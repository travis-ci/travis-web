Travis.Layout.Base = Em.Object.extend
  init: ->
    @parent = @get('parent')

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

    @controller = this["#{$.camelize(@get('name'), false)}Controller"]
    @viewClass = Travis.Views["#{$.camelize(@get('name'))}Layout"]

  connect: ->
    @parent.connectOutlet
      outletName: 'layout'
      controller: @controller
      viewClass: @viewClass
    @connectTop()

  connectTop: ->
    @controller.connectOutlet(outletName: 'top', name: 'top')
    @topController.set('tab', @get('name'))

  activate: (action, params) ->
    this["view#{$.camelize(action)}"](params)

