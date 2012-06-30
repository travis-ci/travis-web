Travis.Layout.Base = Em.Object.extend
  init: ->
    @setup(arguments)
    @connect()

  setup: (controllers) ->
    $.extend this, Travis.Controllers
    $.extend this, Travis.Views

    for name in controllers
      key = "#{name}Controller"
      name = $.camelize(key)
      this[key] = Travis.Controllers[name].create(namespace: this, controllers: this)

  connect: ->
    view = Em.View.create(templateName: "layouts/#{@get('name').toLowerCase()}")
    view.set('controller', @appController)
    view.appendTo(@get('rootElement') || 'body')


