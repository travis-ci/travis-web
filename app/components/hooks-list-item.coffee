`import Ember from 'ember'`
`import config from 'travis/config/environment'`

HooksListItemComponent = Ember.Component.extend
  tagName: 'li'
  classNames: ['row']
  classNameBindings: ['hook.active:active']

  githubOrgsOauthAccessSettingsUrl: config.githubOrgsOauthAccessSettingsUrl

  actions:
    handleToggleError: ->
      @set("showError", true)

    close: ->
      @set("showError", false)

`export default HooksListItemComponent`
