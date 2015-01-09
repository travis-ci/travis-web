Travis.reopen
  RepoView: Travis.View.extend
    templateName: 'repos/show'

    reposBinding: 'controllers.repos'
    repoBinding: 'controller.repo'
    buildBinding: 'controller.build'
    jobBinding: 'controller.job'
    tabBinding: 'controller.tab'

    classNameBindings: ['controller.isLoading:loading']

    isEmpty: (->
      @get('repos.isLoaded') && @get('repos.length') == 0
    ).property('repos.isLoaded', 'repos.length')

    statusImageUrl: (->
      Travis.Urls.statusImage(@get('controller.repo.slug'))
    ).property('controller.repo.slug')

    actions:
      statusImages: () ->
        @popupCloseAll()
        view = Travis.StatusImagesView.create(toolsView: this)
        Travis.View.currentPopupView = view
        view.appendTo($('body'))
        return false

  ReposEmptyView: Travis.View.extend
    template: (->
      if Travis.config.pro
        'pro/repos/show/empty'
      else
        ''
    ).property()

  RepoShowTabsView: Travis.View.extend
    templateName: 'repos/show/tabs'

    tabBinding: 'controller.tab'
    contextBinding: 'controller'

    # hrm. how to parametrize bind-attr?
    classCurrent: (->
      'active' if @get('tab') == 'current'
    ).property('tab')

    classBuilds: (->
      'active' if @get('tab') == 'builds'
    ).property('tab')

    classPullRequests: (->
      'active' if @get('tab') == 'pull_requests'
    ).property('tab')

    classBranches: (->
      'active' if @get('tab') == 'branches'
    ).property('tab')

    classEvents: (->
      'active' if @get('tab') == 'events'
    ).property('tab')

    classBuild: (->
      tab = @get('tab')
      classes = []
      classes.push('active') if tab == 'build'
      classes.push('display-inline') if tab == 'build' || tab == 'job'
      classes.join(' ')
    ).property('tab')

    # TODO: refactor tabs, most of the things here are not really DRY
    classJob: (->
      'active display-inline' if @get('tab') == 'job'
    ).property('tab')

    classRequests: (->
      'active display-inline' if @get('tab') == 'requests'
    ).property('tab')

    classCaches: (->
      'active display-inline' if @get('tab') == 'caches'
    ).property('tab')

    classSettings: (->
      'active display-inline' if @get('tab') == 'settings'
    ).property('tab')

    classRequest: (->
      'active display-inline' if @get('tab') == 'request'
    ).property('tab')

  RepoShowToolsView: Travis.View.extend
    templateName: 'repos/show/tools'

    repoBinding: 'controller.repo'
    buildBinding: 'controller.build'
    jobBinding: 'controller.job'
    tabBinding: 'controller.tab'
    currentUserBinding: 'controller.currentUser'
    slugBinding: 'controller.repo.slug'


    didInsertElement: ->
      self = this
      $('.menu a').on 'click', ->
        self.closeMenu()

    willRemoveElement: ->
      $('.menu a').off 'click'

    closeMenu: ->
      $('.menu').removeClass('display')

    actions:
      menu: ->
        @popupCloseAll()
        $('#tools .menu').toggleClass('display')
        return false

      regenerateKeyPopup: ->
        if @get('canRegenerateKey')
          @set('active', true)
          @closeMenu()
          @popup('regenerate-key-popup')
          return false

      regenerateKey: ->
        @popupCloseAll()

        (@get('repo.content') || @get('repo')).regenerateKey
          success: =>
            @popup('regeneration-success')
          error: ->
            Travis.lookup('controller:flash').loadFlashes([{ error: 'Travis encountered an error while trying to regenerate the key, please try again.'}])

    canRegenerateKey: (->
      @get('hasAdminPermission')
    ).property('hasAdminPermission')

    hasPermission: (->
      if permissions = @get('currentUser.permissions')
        permissions.contains parseInt(@get('repo.id'))
    ).property('currentUser.permissions.length', 'repo.id')

    hasPushPermission: (->
      if permissions = @get('currentUser.pushPermissions')
        permissions.contains parseInt(@get('repo.id'))
    ).property('currentUser.pushPermissions.length', 'repo.id')

    hasAdminPermission: (->
      if permissions = @get('currentUser.adminPermissions')
        permissions.contains parseInt(@get('repo.id'))
    ).property('currentUser.adminPermissions.length', 'repo.id')

    displayRegenerateKey: (->
      @get('canRegenerateKey')
    ).property('canRegenerateKey')

    displaySettingsLink: (->
      @get('hasPushPermission')
    ).property('hasPushPermission')

    displayStatusImages: (->
      @get('hasPermission')
    ).property('hasPermission')

  RepoActionsView: Travis.View.extend
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

      removeLogPopup: ->
        if @get('canRemoveLog')
          @set('active', true)
          @popup(event)
          event.stopPropagation()

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
      @get('jobIdForLog')
    ).property('jobIdForLog')

    _job: (->
      if id = @get('jobIdForLog')
        Travis.Job.find(id)
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
      @get('displayRemoveLog') && @get('hasPermission')
    ).property('displayRemoveLog', 'hasPermission')

    displayRemoveLog: (->
      if job = Travis.Job.find(@get('jobIdForLog'))
        (@get('isJobTab') || (@get('isBuildTab') && @get('build.jobs.length') == 1)) && job.get('canRemoveLog')
    ).property('isJobTab', 'isBuildTab', 'build.jobs.length', '_job.canRemoveLog', 'jobIdForLog')

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

