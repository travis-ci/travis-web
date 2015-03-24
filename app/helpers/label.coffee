`import Ember from 'ember'`

LabelView = Ember.View.extend(
  tagName: 'label'

  attributeBindings: ['for', 'accesskey', 'form']
  classNameBindings: ['class']
)

label = (params, hash, options, env) ->
  view = LabelView

  controller = env.data.view.get('controller')
  name = hash.for
  if name
    labels = controller.get('_labels')
    unless labels
      labels = Ember.Object.create()
      controller.set('_labels', labels)

    # for now I support only label + input in their own context
    id = labels.get(name)
    unless id
      id = "#{name}-#{Math.round(Math.random() * 1000000)}"
      labels.set(name, id)

    hash.for = id
    if hash.content
      view = view.extend(templateName: 'helpers/label')

  env.helpers.view.helperFunction.call(this, [view], hash, options, env)

`export default label`
