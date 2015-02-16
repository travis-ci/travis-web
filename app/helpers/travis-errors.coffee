`import Ember from 'ember'`

ErrorsView = Ember.View.extend
  tagName: 'span'
  templateName: 'helpers/travis-errors'
  classNames: ['error']
  classNameBindings: ['codes', 'show']
  codes: (->
    @get('errors').mapBy('code')
  ).property('@errors', 'errors.length')
  show: Ember.computed.notEmpty('errors.[]')

fn = (name, options) ->
  errors = @get('errors').for(name)
  window[name + 'Errors'] = errors
  view = ErrorsView.create(
    controller: this
    errors: errors
  )

  Ember.Handlebars.helpers.view.call(this, view, options)

`export default fn`
