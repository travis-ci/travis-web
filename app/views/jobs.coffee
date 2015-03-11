`import Ember from 'ember'`
`import BasicView from 'travis/views/basic'`

View = BasicView.extend
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
