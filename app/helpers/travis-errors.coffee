`import Ember from 'ember'`

ErrorsView = Ember.View.extend
  tagName: 'span'
  templateName: 'helpers/travis-errors'
  classNames: ['error']
  classNameBindings: ['codes']
  attributeBindings: ['style']
  style: (->
    'display: none' unless @get('show')
  ).property('show')
  codes: (->
    @get('errors').mapBy('code')
  ).property('@errors')
  show: Ember.computed.notEmpty('errors.[]')

fn = (name, options) ->
  errors = @get('errors').for(name)
  view = ErrorsView.create(
    controller: this
    errors: errors
  )

  Ember.Handlebars.helpers.view.call(this, view, options)

`export default fn`
