Travis.reopen
  RepoView: Travis.View.extend
    templateName: 'repos/show'

    reposBinding: 'controllers.repos'

    classNameBindings: ['controller.isLoading:loading']

    isEmpty: (->
      @get('repos.isLoaded') && @get('repos.length') == 0
    ).property('repos.isLoaded', 'repos.length')

    repoIsLoadedDidChange: (->
      # Ember does not automatically rerender outlets and sometimes 'pane' outlet
      # in repos/show.hbs is empty when view is rerendered without routing
      # taking place. Try to render the default outlet in such case
      # TODO: look into fixing it in more general way
      pane = Ember.get('_outlets.pane')
      if @get('controller.repo.isLoaded') && @state == 'inDOM' &&
         @get('controller.repo.lastBuild') &&
         @get('controller.tab') == 'current' && (!pane || pane.state == 'destroyed')
        view = @get('controller.container').lookup('view:build')
        view.set('controller', @get('controller.container').lookup('controller:build'))
        Ember.run.next =>
          @set('_outlets', {}) if !@get('_outlets') && !@isDestroyed
          @connectOutlet('pane',  view) unless @isDestroyed
    ).observes('controller.repo.isLoaded')

  ReposEmptyView: Travis.View.extend
    template: ''

  RepoShowTabsView: Travis.View.extend
    templateName: 'repos/show/tabs'

    tabBinding: 'controller.tab'
    contextBinding: 'controller'

    # hrm. how to parametrize bindAttr?
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

    classJob: (->
      'active display-inline' if @get('tab') == 'job'
    ).property('tab')

  RepoShowToolsView: Travis.View.extend
    templateName: 'repos/show/tools'

    repoBinding: 'controller.repo'
    buildBinding: 'controller.build'
    jobBinding: 'controller.job'
    tabBinding: 'controller.tab'
    currentUserBinding: 'controller.currentUser'

    closeMenu: ->
      $('.menu').removeClass('display')

    menu: ->
      @popupCloseAll()
      $('#tools .menu').toggleClass('display')
      event.stopPropagation()

    requeue: ->
      @closeMenu()
      @get('build').requeue()

    cancelBuild: ->
      if @get('canCancelBuild')
        @closeMenu()
        Travis.flash(notice: 'Build cancelation has been scheduled.')
        @get('build').cancel().then ->
          Travis.flash(success: 'Build has been successfuly canceled.')
        , (xhr) ->
          if xhr.status == 422
            Travis.flash(error: 'This build can\'t be canceled')
          else if xhr.status == 403
            Travis.flash(error: 'You don\'t have sufficient access to cancel this build')
          else
            Travis.flash(error: 'An error occured when canceling the build')

    cancelJob: ->
      if @get('canCancelJob')
        @closeMenu()
        Travis.flash(notice: 'Job cancelation has been scheduled.')
        @get('job').cancel().then ->
          Travis.flash(success: 'Job has been successfuly canceled.')
        , (xhr) ->
          if xhr.status == 422
            Travis.flash(error: 'This job can\'t be canceled')
          else if xhr.status == 403
            Travis.flash(error: 'You don\'t have sufficient access to cancel this job')
          else
            Travis.flash(error: 'An error occured when canceling the job')

    statusImages: ->
      @set('active', true)
      @closeMenu()
      @popupCloseAll()
      view = Travis.StatusImagesView.create(toolsView: this)
      # TODO: create a general mechanism for managing current popup
      #       and move all popups to use it
      Travis.View.currentPopupView = view
      view.appendTo($('body'))
      event.stopPropagation()

    regenerateKeyPopup: ->
      if @get('canRegenerateKey')
        @set('active', true)
        @closeMenu()
        @popup(event)
        event.stopPropagation()

    codeClimatePopup: ->
      @set('active', true)
      @closeMenu()
      @popup(event)
      event.stopPropagation()
      
    requeueBuild: ->
      if @get('canRequeueBuild')
        @closeMenu()
        @get('build').requeue()

    requeueJob: ->
      if @get('canRequeueJob')
        @closeMenu()
        @get('job').requeue()

    regenerateKey: ->
      @popupCloseAll()

      (@get('repo.content') || @get('repo')).regenerateKey
        success: =>
          @popup('regeneration-success')
        error: ->
          Travis.lookup('controller:flash').loadFlashes([{ error: 'Travis encountered an error while trying to regenerate the key, please try again.'}])

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

    jobIdForLog: (->
      @get('job.id') ||
        (@get('build.jobs.length') == 1 && @get('build.jobs.firstObject.id'))
    ).property('job.id', 'build.jobs.firstObject.id', 'build.jobs.length')

    plainTextLogUrl: (->
      if id = @get('jobIdForLog')
        Travis.Urls.plainTextLog(id)
    ).property('jobIdForLog')

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

    displayRegenerateKey: true

    canRegenerateKey: (->
      @get('displayRegenerateKey') && @get('hasPermission')
    ).property('hasPermission')


    isJobTab: (->
      @get('tab') == 'job'
    ).property('tab')

    isBuildTab: (->
      ['current', 'build'].indexOf(@get('tab')) > -1
    ).property('tab')

    hasPermission: (->
      if permissions = @get('currentUser.permissions')
        permissions.contains parseInt(@get('repo.id'))
    ).property('currentUser.permissions.length', 'repo.id')

    displayCodeClimate: (->
      Travis.config.code_climate == "true" and @get('repo.githubLanguage') == 'Ruby'
    ).property('repo.githubLanguage')
