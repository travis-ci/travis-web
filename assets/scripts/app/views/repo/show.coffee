@Travis.reopen
  RepoView: Travis.View.extend
    templateName: 'repos/show'

    repoBinding: 'controller.repo'

    class: (->
      'loading' unless @get('repo.isLoaded')
    ).property('repo.isLoaded')

    urlGithub: (->
      Travis.Urls.githubRepo(@get('repo.slug'))
    ).property('repo.slug'),

    urlGithubWatchers: (->
      Travis.Urls.githubWatchers(@get('repo.slug'))
    ).property('repo.slug'),

    urlGithubNetwork: (->
      Travis.Urls.githubNetwork(@get('repo.slug'))
    ).property('repo.slug'),

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

    menu: ->
      @popupCloseAll()
      element = $('#tools .menu').toggleClass('display')

    requeue: ->
      @closeMenu()
      @get('build').requeue()

    statusImages: (event) ->
      @set('active', true)
      @closeMenu()
      @popup(event)

    canPush: (->
      @get('isBuildTab') && @get('build.isFinished') && @get('hasPushPermissions')
    ).property('build.isFinished', 'hasPushPermissions', 'isBuildTab')

    isBuildTab: (->
      ['current', 'build', 'job'].indexOf(@get('tab')) > -1
    ).property('tab')

    hasPushPermissions: (->
      Travis.app.get('currentUser.permissions').indexOf(@get('repo.id')) > -1
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

