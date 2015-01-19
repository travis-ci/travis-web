notEmpty = Ember.computed.notEmpty

ErrorsView = Ember.View.extend
  tagName: 'span'
  template: Ember.Handlebars.compile("{{#each view.errors}}{{message}}{{/each}}")
  classNames: ['error']
  classNameBindings: ['codes']
  attributeBindings: ['style']
  style: (->
    'display: none' unless @get('show')
  ).property('show')
  codes: (->
    @get('errors').mapBy('code')
  ).property('@errors')
  show: notEmpty('errors.[]')

fn = (name, options) ->
  errors = @get('errors').for(name)
  view = ErrorsView.create(
    controller: this
    errors: errors
  )

  Ember.Handlebars.helpers.view.call(this, view, options)

Travis.Handlebars.travisErrors = fn
