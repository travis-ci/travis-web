`import Ember from 'ember'`

SettingsController = Ember.Controller.extend
  concurrentBuildsLimitDescription: (->
    description = "Limit concurrent jobs"
    if @get('concurrentBuildsLimit')
      description += ": "
    description
  ).property('concurrentBuildsLimit')

  envVars: Ember.computed.filterBy('model.envVars', 'isNew', false)

  actions:
    sshKeyAdded: (sshKey) ->
      @set('model.customSshKey', sshKey)

    sshKeyDeleted: ->
      @set('model.customSshKey', null)

    concurrentBuildsLimitChanged: ->
      unless @get('concurrentBuildsLimit')
        return if @get('isSaving')
        @set('isSaving', true)

        savingFinished = =>
          @set('isSaving', false)

        @get('repo').saveSettings(maximum_number_of_builds: 0).then(savingFinished, savingFinished)
        @set('model.settings.maximum_number_of_builds', 0)

    concurrentBuildsLimitValueChanged: ->
      repo = @get('repo')
      concurrentBuildsLimit = parseInt(@get('model.settings.maximum_number_of_builds'))
      if concurrentBuildsLimit
        @set('isSaving', true)
        savingFinished = =>
          @set('isSaving', false)

        repo.saveSettings(maximum_number_of_builds: concurrentBuildsLimit).
          then(savingFinished, savingFinished)

`export default SettingsController`
