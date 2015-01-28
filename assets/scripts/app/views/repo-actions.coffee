View = Travis.View.extend
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


    removeLog: ->
      @popupCloseAll()
      if @get('canRemoveLog')
        job = @get('_job') || @get('build.jobs.firstObject')
        job.removeLog().then ->
          Travis.flash(success: 'Log has been successfully removed.')
        , (xhr) ->
          if xhr.status == 409
            Travis.flash(error: 'Log can\'t be removed')
          else if xhr.status == 401
            Travis.flash(error: 'You don\'t have sufficient access to remove the log')
          else
            Travis.flash(error: 'An error occured when removing the log')

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

    removeLogPopup: ->
      if @get('canRemoveLog')
        @set('active', true)
        @popup('remove-log-popup')
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
  ).property('displayRequireBuild', 'hasPermission')

  displayRequeueJob: (->
    @get('isJobTab') && @get('job.isFinished')
  ).property('isJobTab', 'job.isFinished')

  canRequeueJob: (->
    @get('displayRequeueJob') && @get('hasPermission')
  ).property('displayRequeueJob', 'hasPermission')

  showDownloadLog: (->
    @get('jobIdForLog') && (@get('isJobTab') || @get('isBuildTab'))
  ).property('jobIdForLog', 'isJobTab', 'isBuildTab')

  _job: (->
    if id = @get('jobIdForLog')
      store =Travis.__container__.lookup('store:main')
      store.find('job', id)
      store.recordForId('job', id)
  ).property('jobIdForLog')

  jobIdForLog: (->
    job = @get('job.id')
    unless job
      if @get('build.jobs.length') == 1
        job = @get('build.jobs').objectAt?(0).get?('id')
    job
  ).property('job.id', 'build.jobs.firstObject.id', 'build.jobs.length')

  plainTextLogUrl: (->
    if id = @get('jobIdForLog')
      url = Travis.Urls.plainTextLog(id)
      if Travis.config.pro
        token = @get('job.log.token') || @get('build.jobs.firstObject.log.token')
        url += "&access_token=#{token}"
      url
  ).property('jobIdForLog', 'job.log.token', 'build.jobs.firstObject.log.token')

  canRemoveLog: (->
    @get('displayRemoveLog')
  ).property('displayRemoveLog')

  displayRemoveLog: (->
    if job = @get('_job')
      (@get('isJobTab') || (@get('isBuildTab') && @get('build.jobs.length') == 1)) &&
        job.get('canRemoveLog') && @get('hasPermission')
  ).property('isJobTab', 'isBuildTab', 'build.jobs.length', '_job.canRemoveLog', 'jobIdForLog', 'canRemoveLog', 'hasPermission')

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

Travis.RepoActionsView = View
