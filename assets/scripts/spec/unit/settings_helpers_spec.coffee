view = null

module "Handlebars helpers - settings-input",
  setup: ->
    Ember.run -> Travis.advanceReadiness()

test "settings input allows to bind to nested objects", ->
  controller = Ember.Object.create()
  view = Ember.View.create(
    controller: controller
    template: Ember.Handlebars.compile("{{input value=foo}} {{controller}}")
  )

  Ember.run ->
    view.append()


  Ember.run ->
    controller.set('foo', 'bar')

  Ember.run.sync()

  input = view.$('input')
  input.val('a value').change()
  Ember.run.sync()

  console.log controller.get('foo')

