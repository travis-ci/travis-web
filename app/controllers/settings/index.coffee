`import Ember from 'ember'`

Controller = Ember.Controller.extend
  settings: Ember.computed.alias('model.settings')

  settingsChanged: (->
    value = @get('settings.maximum_number_of_builds')
    console.log value
    if parseInt(value) > 0 || value == '0' || value == 0
      @set('settings.maximum_number_of_builds_valid', '')
      @get('model').saveSettings(@get('settings')).then null, ->
        Travis.flash(error: 'There was an error while saving settings. Please try again.')
    else
      @set('settings.maximum_number_of_builds_valid', 'invalid')
  ).observes('settings.maximum_number_of_builds')

  actions:
    save: ->
      @get('model').saveSettings(@get('settings')).then null, ->
        Travis.flash(error: 'There was an error while saving settings. Please try again.')

`export default Controller`
