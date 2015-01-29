FormFieldRowView = Ember.View.extend
  invalid: Ember.computed.notEmpty('errors.[]')
  classNameBindings: ['invalid']
  classNames: 'field'

fn = (name, options) ->
  errors = @get('errors').for(name)
  template = options.fn
  delete options.fn

  view = FormFieldRowView.create(
    controller: this
    template: template
    errors: errors
    name: name
    classNameBindings: ['name']
  )

  Ember.Handlebars.helpers.view.call(this, view, options)

Travis.Handlebars.travisField = fn
