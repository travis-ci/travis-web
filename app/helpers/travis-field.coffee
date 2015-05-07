`import Ember from 'ember'`

FormFieldRowView = Ember.View.extend
  invalid: Ember.computed.notEmpty('errors.[]')
  classNameBindings: ['invalid']
  classNames: 'field'

fn = (params, hash, options, env) ->
  name = params[0]
  controller = env.data.view.get('controller')
  errors = controller.get('errors').for(name)
  template = options.template
  delete options.template

  view = FormFieldRowView.create(
    controller: controller
    template: template
    errors: errors
    name: name
    classNameBindings: ['name']
  )

  env.helpers.view.helperFunction.call(this, [view], hash, options, env)

`export default fn`
