`import Ember from 'ember'`
`import Job from 'travis/models/job'`
`import config from 'travis/config/environment'`
`import BasicView from 'travis/views/basic'`

View = BasicView.extend
  templateName: 'repos/show/actions'

  repoBinding: 'controller.repo'
  buildBinding: 'controller.build'
  jobBinding: 'controller.job'
  tabBinding: 'controller.tab'
  currentUserBinding: 'controller.currentUser'

  actions:
    requeueBuild: ->
      if @get('canRequeueBuild')
        @requeue @get('build')

    requeueJob: ->
      if @get('canRequeueJob')
        @requeue @get('_job')

    cancelBuild: ->
      if @get('canCancelBuild')
        Travis.flash(notice: 'Build cancellation has been scheduled.')
        @get('build').cancel().then ->
          Travis.flash(success: 'Build has been successfully canceled.')
        , (xhr) ->
          if xhr.status == 422
            Travis.flash(error: 'This build can\'t be canceled')
          else if xhr.status == 403
            Travis.flash(error: 'You don\'t have sufficient access to cancel this build')
          else
            Travis.flash(error: 'An error occured when canceling the build')


    cancelJob: ->
      if @get('canCancelJob')
        Travis.flash(notice: 'Job cancellation has been scheduled.')
        @get('_job').cancel().then ->
          Travis.flash(success: 'Job has been successfully canceled.')
        , (xhr) ->
          if xhr.status == 422
            Travis.flash(error: 'This job can\'t be canceled')
          else if xhr.status == 403
            Travis.flash(error: 'You don\'t have sufficient access to cancel this job')
          else
            Travis.flash(error: 'An error occured when canceling the job')

    codeClimatePopup: ->
      @popupCloseAll()
      @popup('code-climate')
      return false

  hasPermission: (->
    if permissions = @get('currentUser.permissions')
      permissions.contains parseInt(@get('repo.id'))
  ).property('currentUser.permissions.length', 'repo.id')

  hasPushPermission: (->
    if permissions = @get('currentUser.pushPermissions')
      permissions.contains parseInt(@get('repo.id'))
  ).property('currentUser.pushPermissions.length', 'repo.id')

  displayRequeueBuild: (->
    @get('isBuildTab') && @get('build.isFinished')
  ).property('isBuildTab', 'build.isFinished')

  canRequeueBuild: (->
    @get('displayRequeueBuild') && @get('hasPermission')
  ).property('displayRequeueBuild', 'hasPermission')

  displayRequeueJob: (->
    @get('isJobTab') && @get('job.isFinished')
  ).property('isJobTab', 'job.isFinished')

  canRequeueJob: (->
    @get('displayRequeueJob') && @get('hasPermission')
  ).property('displayRequeueJob', 'hasPermission')

  canCancelBuild: (->
    @get('displayCancelBuild') && @get('hasPermission')
  ).property('displayCancelBuild', 'hasPermission')

  displayCancelBuild: (->
    @get('isBuildTab') && @get('build.canCancel')
  ).property('isBuildTab', 'build.canCancel')

  canCancelJob: (->
    @get('displayCancelJob') && @get('hasPermission')
  ).property('displayCancelJob', 'hasPermission')

  displayCancelJob: (->
    @get('isJobTab') && @get('job.canCancel')
  ).property('isJobTab', 'job.canCancel')

  isJobTab: (->
    @get('tab') == 'job'
  ).property('tab', 'repo.id')

  isBuildTab: (->
    ['current', 'build'].indexOf(@get('tab')) > -1
  ).property('tab')

  displayCodeClimate: (->
    @get('repo.githubLanguage') == 'Ruby'
  ).property('repo.githubLanguage')

  requeueFinished: ->
    @set('requeueing', false)

  requeue: (thing) ->
    return if @get('requeueing')
    @set('requeueing', true)
    thing.requeue().then(this.requeueFinished.bind(this), this.requeueFinished.bind(this))

`export default View`
