`import Ember from 'ember'`

originalInputHelper = Ember.Handlebars.helpers.input

input = (options) ->
  # for now I can match label only with the property name
  # passed here matches the label
  name = (options.hash.value || options.hash.checked)
  id   = options.hash.id

  # generate id only if it's not given
  if name && !name.match(/\./) && !id
    labels = @get('_labels')
    unless labels
      labels = Ember.Object.create()
      @set('_labels', labels)

    # for now I support only label + input in their own context
    id = labels.get(name)
    unless id
      id = "#{name}-#{Math.round(Math.random() * 1000000)}"
      labels.set(name, id)

    options.hash.id = id
    options.hashTypes.id = 'STRING'
    options.hashContexts.id = this

  originalInputHelper.call(this, options)

`export default input`
