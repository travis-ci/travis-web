`import Ember from 'ember'`

SettingsSwitchComponent = Ember.Component.extend

  tagName: 'a'
  classNames: ['switch']
  classNameBindings: ['active']

  click: ->
    return if @get('isSaving')
    @set('isSaving', true)
    @toggleProperty('active')
    setting = {}
    setting[@get('key')] = @get('active')
    @get('repo').saveSettings(setting).then =>
      @set('isSaving', false)
    , =>
      @set('isSaving', false)
      Travis.flash(error: 'There was an error while saving settings. Please try again.')

`export default SettingsSwitchComponent`
