Travis.RepoSettingsController = Em.ObjectController.extend
  tabs:
    index: "General Settings"
    env_vars: "Environment Variables"
    ssh_key: "SSH Key"

  init: ->
    @_super.apply this, arguments

    tabs = []
    @set('_tabs', tabs)
    for own id, name of @get('tabs')
      tabs.pushObject Travis.Tab.create(id: id, name: name)

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

  save: ->
    @get('model').saveSettings(@get('settings')).then null, ->
      Travis.flash(error: 'There was an error while saving settings. Please try again.')
