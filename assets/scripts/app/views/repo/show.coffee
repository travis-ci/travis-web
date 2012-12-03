@Travis.reopen
  RepoView: Travis.View.extend
    templateName: 'repos/show'

    reposBinding: 'controller.repos'
    repoBinding:  'controller.repo'

    class: (->
      'loading' unless @get('repo.isLoaded')
    ).property('repo.isLoaded')

    isEmpty: (->
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

    canCancelBuild: (->
      @get('isBuildTab') && @get('build.canCancel') && @get('hasPermission')
    ).property('build.state', 'hasPermission', 'tab')

    canRegenerateKey: (->
      @get('hasPermissions')
    ).property('hasPermissions')

    canCancelJob: (->
      @get('isJobTab') && @get('job.canCancel') && @get('hasPermission')
    ).property('job.state', 'hasPermission', 'tab')


    isJobTab: (->
      @get('tab') == 'job'
    ).property('tab')

    isBuildTab: (->
      ['current', 'build'].indexOf(@get('tab')) > -1
    ).property('tab')

    hasPermission: (->
      if permissions = Travis.app.get('currentUser.permissions')
        permissions.indexOf(@get('repo.id')) > -1
    ).property('Travis.app.currentUser.permissions.length', 'repo.id')


    branches: (->
      @get('repo.branches') if @get('active')
    ).property('active', 'repo.branches')

    urlRepo: (->
      'https://' + location.host + Travis.Urls.repo(@get('repo.slug'))
    ).property('repo.slug')

    urlStatusImage: (->
      Travis.Urls.statusImage(@get('repo.slug'), @get('branch.commit.branch'))
    ).property('repo.slug', 'branch')

    markdownStatusImage: (->
      "[![Build Status](#{@get('urlStatusImage')})](#{@get('urlRepo')})"
    ).property('urlStatusImage')

    textileStatusImage: (->
      "!#{@get('urlStatusImage')}!:#{@get('urlRepo')}"
    ).property('urlStatusImage')

    rdocStatusImage: (->
      "{<img src=\"#{@get('urlStatusImage')}\" alt=\"Build Status\" />}[#{@get('urlRepo')}]"
    ).property('urlStatusImage')

