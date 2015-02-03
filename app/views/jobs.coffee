`import Ember from 'ember'`

View = Ember.View.extend
  templateName: 'jobs'
  buildBinding: 'controller.build'

  jobTableId: Ember.computed(->
    if @get('required')
      'jobs'
    else
      'allowed_failure_jobs'
  )

  actions:
    popupClose: ->
      @popupCloseAll()

    openHelpPopup: ->
      @popupCloseAll()
      @popup('help-allowed_failures')

`export default View`
