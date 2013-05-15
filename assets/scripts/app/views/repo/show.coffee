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
         @get('controller.tab') == 'current' && (!pane || pane.state == 'destroyed')
        view = @get('controller.container').lookup('view:build')
        view.set('controller', @get('controller.container').lookup('controller:build'))
        Ember.run.next =>
          @set('_outlets', {}) if !@get('_outlets') && !@isDestroyed
          @connectOutlet('pane',  view)
    ).observes('controller.repo.isLoaded')

  ReposEmptyView: Travis.View.extend
    template: ''

  RepoShowTabsView: Travis.View.extend
    templateName: 'repos/show/tabs'

    repoBinding: 'controller.repo'
    buildBinding: 'controller.build'
    jobBinding: 'controller.job'
    tabBinding: 'controller.tab'

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
        @get('build').cancel()

    cancelJob: ->
      if @get('canCancelJob')
        @closeMenu()
        @get('job').cancel()

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

    displayCancelBuild: (->
      # @get('isBuildTab') && @get('build.canCancel')
      false
    ).property('build.state', 'tab')

    canCancelBuild: (->
      # @get('displayCancelBuild') && @get('hasPermission')
      false
    ).property('displayCancelBuild', 'hasPermission')

    displayCancelJob: (->
      # @get('isJobTab') && @get('job.canCancel')
      false
    ).property('job.state', 'tab')

    canCancelJob: (->
      # @get('displayCancelJob') && @get('hasPermission')
      false
    ).property('displayCancelJob', 'hasPermission')

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
