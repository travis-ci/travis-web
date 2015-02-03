`import Ember from 'ember'`

LabelView = Ember.View.extend(
  tagName: 'label'

  attributeBindings: ['for', 'accesskey', 'form']
  classNameBindings: ['class']
)

label = (options) ->
  view = LabelView

  name = options.hash.for
  if name
    labels = @get('_labels')
    unless labels
      labels = Ember.Object.create()
      @set('_labels', labels)

    # for now I support only label + input in their own context
    id = labels.get(name)
    unless id
      id = "#{name}-#{Math.round(Math.random() * 1000000)}"
      labels.set(name, id)

    options.hash.for = id
    options.hashTypes.for = 'STRING'
    options.hashContexts.for = this
    if options.hash.content
      options.fn = Ember.Handlebars.compile("{{view.content}}")

  Ember.Handlebars.helpers.view.call(this, view, options)

`export default label`
