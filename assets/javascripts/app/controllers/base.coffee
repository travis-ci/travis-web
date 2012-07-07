Travis.Controller = Em.Controller.extend
  init: ->
    for name in Array.prototype.slice.apply(arguments)
      name = "#{$.camelize(name, false)}Controller"
      klass = Travis[$.camelize(name)] || Em.Controller
      this[name] = klass.create(parent: this, namespace: Travis, controllers: this)

  connectTop: ->
    @connectOutlet(outletName: 'top', controller: @topController, viewClass: Travis.TopView)
    @topController.set('tab', @get('name'))

