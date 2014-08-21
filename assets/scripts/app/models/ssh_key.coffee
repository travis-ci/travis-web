Travis.SshKey = Travis.Model.extend
  id:          Ember.attr('string')
  value:       Ember.attr('string')
  description: Ember.attr('string')
  fingerprint: Ember.attr('string')

  isPropertyLoaded: (key) ->
    if key == 'value'
      return true
    else
      @_super(key)


