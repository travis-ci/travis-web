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

fn = (params, hash, options, env) ->
  controller = env.data.view.get('controller')
  errors = controller.get('errors').for(name)
  view = ErrorsView.create(
    controller: controller
    errors: errors
  )

  env.helpers.view.helperFunction.call(this, [view], hash, options, env)

`export default fn`
