View = Ember.View.extend
  templateName: 'jobs/list'
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

Travis.JobsView = View
