view = null

module "Handlebars helpers - settings-input",
  setup: ->
    Ember.run -> Travis.advanceReadiness()

test "settings input allows to bind to nested objects", ->
  controller = Ember.Object.create()
  view = Ember.View.create(
    controller: controller
    template: Ember.Handlebars.compile("{{settings-input value=foo.bar.baz}}")
  )

  Ember.run ->
    view.appendTo($("#ember-testing")[0])


  input = view.$('input')

  Ember.run ->
    input.val('a value').change()

  equal(controller.get('foo.bar.baz'), 'a value')

  Ember.run ->
    controller.set('foo.bar.baz', 'a new value')

  equal(input.val(), 'a new value')
