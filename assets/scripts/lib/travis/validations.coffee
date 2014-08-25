get = Ember.get

Error = Ember.Object.extend
  message: (->
    switch code = @get('code')
      when 'blank' then "can't be blank"
      when 'not_a_private_key' then "the key is not a valid private key"
      when 'key_with_a_passphrase' then 'we can\'t use key with a passphrase'
      else @humanize(code)
  ).property('code')

  humanize: (str) ->
    str.replace(/_id$/, '').replace(/_/g, ' ').replace(/^\w/g, (s) -> s.toUpperCase())

FieldErrors = Ember.ArrayProxy.extend
  add: (error) ->
    @get('content').pushObject(error)

  isValid: ->
    @get('length') == 0

Errors = Ember.ArrayProxy.extend
  for: (name) ->
    fieldErrors = @findBy('name', name)
    unless fieldErrors
      fieldErrors = FieldErrors.create(name: name, content: [])
      @get('content').pushObject(fieldErrors)

    fieldErrors

  add: (name, code) ->
    @for(name).add(Error.create(name: name, code: code))

  isValid: ->
    @every (fieldErrors) -> fieldErrors.isValid()

  clear: ->
    @forEach (fieldErrors) -> fieldErrors.clear()

Validator = Ember.Object.extend
  setError: (target) ->
    target.get('errors').add(@get('name'), @get('code'))

  isValid: (target) ->
    name = @get('name')
    @get('validator').call(target, get(target, name))

  validate: (target) ->
    unless @isValid(target)
      @setError(target)

Travis.Validations = Ember.Mixin.create
  init: ->
    @_super.apply this, arguments

    @validators = []
    @set('errors', Errors.create(content: []))

    if validations = @get('validates')
      for field, properties of validations
        for property in properties
          @_addValidation(field, property)

  _addValidation: (name, type) ->
    observer = ->
      @get('errors').for(name).clear()
    @addObserver(name, this, observer)
    @["_add#{type.capitalize()}Validator"].call(this, name)

  _addPresenceValidator: (name) ->
    @_addValidator name, "blank", (value) ->
      !Ember.isBlank(value)

  _addValidator: (name, code, validator) ->
    @validators.pushObject(Validator.create(name: name, code: code, validator: validator))

  validate: ->
    @get('errors').clear()
    for validator in @validators
      validator.validate(this)

  isValid: ->
    @validate()
    @get('errors').isValid()

  clearValidations: ->
    @get('errors').clear()

  addErrorsFromResponse: (errors) ->
    for error in errors
      @get('errors').add(error.field, error.code)
