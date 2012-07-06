Travis.Controller = Em.Controller.extend
  init: ->
    for name in Array.prototype.slice.apply(arguments)
      name = "#{$.camelize(name, false)}Controller"
      klass = Travis[$.camelize(name)] || Em.Controller
      this[name] = klass.create(namespace: Travis, controllers: this)

  connect: (parent) ->
    parent.connectOutlet
      outletName: 'layout'
      controller: this
      viewClass: Travis["#{$.camelize(@get('name'))}Layout"]

  connectTop: ->
    @connectOutlet
      outletName: 'top'
      controller: @topController
      viewClass: Travis.TopView
    @topController.set('tab', @get('name'))

