@Travis.reopen
  RepositoryView: Travis.View.extend
    templateName: 'repos/show'

    repositoryBinding: 'controller.repository'

    class: (->
      'loading' unless @get('repository.isLoaded')
    ).property('repository.isLoaded')

    urlGithub: (->
      Travis.Urls.githubRepository(@get('repository.slug'))
    ).property('repository.slug'),

    urlGithubWatchers: (->
      Travis.Urls.githubWatchers(@get('repository.slug'))
    ).property('repository.slug'),

    urlGithubNetwork: (->
      Travis.Urls.githubNetwork(@get('repository.slug'))
    ).property('repository.slug'),

  RepoShowTabsView: Travis.View.extend
    templateName: 'repos/show/tabs'

    repositoryBinding: 'controller.repository'
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
      classes.push('display') if tab == 'build' || tab == 'job'
      classes.join(' ')
    ).property('tab')

    classJob: (->
      'active display' if @get('tab') == 'job'
    ).property('tab')

    urlRepository: (->
      Travis.Urls.repository(@get('repository.slug'))
    ).property('repository.slug')

    urlBuilds: (->
      Travis.Urls.builds(@get('repository.slug'))
    ).property('repository.slug')

    urlPullRequests: (->
      Travis.Urls.pullRequests(@get('repository.slug'))
    ).property('repository.slug')

    urlBranches: (->
      Travis.Urls.branches(@get('repository.slug'))
    ).property('repository.slug')

    urlBuild: (->
      Travis.Urls.build(@get('repository.slug'), @get('build.id'))
    ).property('repository.slug', 'build.id')

    urlJob: (->
      Travis.Urls.job(@get('repository.slug'), @get('job.id'))
    ).property('repository.slug', 'job.id')

  RepoShowToolsView: Travis.View.extend
    templateName: 'repos/show/tools'

    repositoryBinding: 'controller.repository'
    buildBinding: 'controller.build'
    jobBinding: 'controller.job'
    tabBinding: 'controller.tab'

    toggle: ->
      @set('active', !@get('active'))
      $('#tools .pane').toggle()

    branches: (->
      @get('repository.branches') if @get('active')
    ).property('active', 'repository.branches')

    urlRepository: (->
      'https://' + location.host + Travis.Urls.repository(@get('repository.slug'))
    ).property('repository.slug')

    urlStatusImage: (->
      Travis.Urls.statusImage(@get('repository.slug'), @get('branch.commit.branch'))
    ).property('repository.slug', 'branch')

    markdownStatusImage: (->
      "[![Build Status](#{@get('urlStatusImage')})](#{@get('urlRepository')})"
    ).property('urlStatusImage')

    textileStatusImage: (->
      "!#{@get('urlStatusImage')}!:#{@get('urlRepository')}"
    ).property('urlStatusImage')

    rdocStatusImage: (->
      "{<img src=\"#{@get('urlStatusImage')}\" alt=\"Build Status\" />}[#{@get('urlRepository')}]"
    ).property('urlStatusImage')

