@Travis.reopen
  RepoView: Travis.View.extend
    templateName: 'repos/show'

    reposBinding: 'controller.repos'
    repoBinding:  'controller.repo'

    class: (->
      'loading' unless @get('repo.isLoaded')
    ).property('repo.isLoaded')

    isEmpty: (->
      console.log('repos.isLoaded', @get('repos.isLoaded'))
      console.log('repos.length', @get('repos.length'))
      @get('repos.isLoaded') && @get('repos.length') == 0
    ).property('repos.isLoaded', 'repos.length')

    urlGithub: (->
      Travis.Urls.githubRepo(@get('repo.slug'))
    ).property('repo.slug'),

  RepoShowStatsView: Travis.View.extend
    templateName: 'repos/show/stats'
    repoBinding:  'parentView.repo'
    statsBinding: 'repo.stats'

    urlGithubWatchers: (->
      Travis.Urls.githubWatchers(@get('repo.slug'))
    ).property('repo.slug'),

    urlGithubNetwork: (->
      Travis.Urls.githubNetwork(@get('repo.slug'))
    ).property('repo.slug'),

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

    closeMenu: ->
      $('.menu').removeClass('display')

    menu: (event) ->
      @popupCloseAll()
      element = $('#tools .menu').toggleClass('display')
      event.stopPropagation()

    requeue: ->
      @closeMenu()
      @get('build').requeue()

    cancelBuild: ->
      @closeMenu()
      @get('build').cancel()

    cancelJob: ->
      @closeMenu()
      @get('job').cancel()

    statusImages: (event) ->
      @set('active', true)
      @closeMenu()
      @popup(event)
      event.stopPropagation()

    regenerateKeyPopup: (event) ->
      @set('active', true)
      @closeMenu()
      @popup(event)
      event.stopPropagation()

    requeueBuild: ->
      @closeMenu()
      @get('build').requeue()

    requeueJob: ->
      @closeMenu()
      @get('job').requeue()

    regenerateKey: ->
      @popupCloseAll()
      self = this

      @get('repo').regenerateKey
        success: ->
          self.popup('regeneration-success')
        error: ->
          Travis.app.router.flashController.loadFlashes([{ error: 'Travis encountered an error while trying to regenerate the key, please try again.'}])

    canRequeueBuild: (->
      @get('isBuildTab') && @get('build.isFinished') && @get('hasPermission')
    ).property('isBuildTab', 'build.isFinished', 'hasPermissions')

    canRequeueJob: (->
      @get('isJobTab') && @get('job.isFinished') && @get('hasPermission')
    ).property('isJobTab', 'job.isFinished', 'hasPermissions')

    showDownloadLog: (->
      @get('logId')
    ).property('logId')

    logId: (->
      @get('job.log.id') ||
        (@get('build.jobs.length') == 1 && @get('build.jobs.firstObject.log.id'))
    ).property('job.log.id', 'build.jobs.firstObject.log.id', 'build.jobs.length')

    plainTextLogUrl: (->
      if id = @get('logId')
        Travis.Urls.plainTextLog(id)
    ).property('logId')

    canCancelBuild: (->
      # @get('isBuildTab') && @get('build.canCancel') && @get('hasPermission')
      false
    ).property('build.state', 'hasPermission', 'tab')

    canCancelJob: (->
      # @get('isJobTab') && @get('job.canCancel') && @get('hasPermission')
      false
    ).property('job.state', 'hasPermission', 'tab')

    canRegenerateKey: (->
      @get('hasPermission')
    ).property('hasPermission')


    isJobTab: (->
      @get('tab') == 'job'
    ).property('tab')

    isBuildTab: (->
      ['current', 'build'].indexOf(@get('tab')) > -1
    ).property('tab')

    hasPermission: (->
      if permissions = Travis.app.get('currentUser.permissions')
        permissions.contains @get('repo.id')
    ).property('Travis.app.currentUser.permissions.length', 'repo.id')

    urlRepo: (->
      "https://#{location.host}/#{@get('repo.slug')}"
    ).property('repo.slug')

    branches: (->
      @get('repo.branches') if @get('active')
    ).property('active', 'repo.branches')

    setStatusImageBranch: (->
      if @get('repo.branches.isLoaded')
        @set('statusImageBranch', @get('repo.branches').findProperty('commit.branch', @get('build.commit.branch')))
      else
        @set('statusImageBranch', null)
    ).observes('repo.branches', 'repo.branches.isLoaded', 'build.commit.branch')

    statusImageUrl: (->
      Travis.Urls.statusImage(@get('repo.slug'), @get('statusImageBranch.commit.branch'))
    ).property('repo.slug', 'statusImageBranch')

    markdownStatusImage: (->
      "[![Build Status](#{@get('statusImageUrl')})](#{@get('urlRepo')})"
    ).property('statusImageUrl')

    textileStatusImage: (->
      "!#{@get('statusImageUrl')}!:#{@get('urlRepo')}"
    ).property('statusImageUrl')

    rdocStatusImage: (->
      "{<img src=\"#{@get('statusImageUrl')}\" alt=\"Build Status\" />}[#{@get('urlRepo')}]"
    ).property('statusImageUrl')

    asciidocStatusImage: (->
      "image:#{@get('statusImageUrl')}[\"Build Status\", link=\"#{@get('urlRepo')}\"]"
    ).property('statusImageUrl')
