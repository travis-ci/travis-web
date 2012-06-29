Travis.Layout = Em.Object.extend
  init: ->
    @setupControllers()
    @setupViews()
    @connectLeft(Travis.Repository.find())

  setupControllers: ->
    $.extend this, Travis.Controllers
    for name, controller of Travis.Controllers
      name = name.charAt(0).toLowerCase() + name.substr(1)
      this[name] = controller.create(namespace: this, controllers: this)

  setupViews: ->
    $.extend this, Travis.Views
    view = Travis.Views.ApplicationView.create()
    view.set('controller', @applicationController)
    view.appendTo(@get('rootElement') || 'body')

Travis.Layout.instance = (name) ->
  if @layout && @layout.name == name
    @layout
  else
    @layout = Travis.Layout[name].create(name: name)

require 'layouts/default'

