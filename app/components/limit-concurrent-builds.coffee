`import Ember from 'ember'`

LimitConcurrentBuildsComponent = Ember.Component.extend
  
  classNames: ['limit-concurrent-builds']

  description: (->
    description = "Limit concurrent jobs"
    if @get('enabled')
      description += "  "
    description
  ).property('enabled')


  actions:
    toggle: ->
      unless @get('enabled')
        return if @get('value') == 0
        return if @get('isSaving')
        @set('isSaving', true)

        savingFinished = =>
          @set('isSaving', false)

        @get('repo').saveSettings(maximum_number_of_builds: 0).then(savingFinished, savingFinished)
        @set('value', 0)

    limitChanged: ->
      repo = @get('repo')
      limit = parseInt(@get('value'))
      if limit
        @set('isSaving', true)
        savingFinished = =>
          @set('isSaving', false)

        repo.saveSettings(maximum_number_of_builds: limit).
          then(savingFinished, savingFinished)


`export default LimitConcurrentBuildsComponent`
