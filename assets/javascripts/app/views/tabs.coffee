@Travis.reopen
  TabsView: Em.View.extend
    templateName: 'repositories/tabs'

    repositoryBinding: 'controller.repository'
    buildBinding: 'controller.build'
    jobBinding: 'controller.job'
    tabBinding: 'controller.tab'

    toggleTools: ->
      $('#tools .pane').toggle()

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
      Travis.Urls.repository(@getPath('repository.slug'))
    ).property('repository.slug')

    urlBuilds: (->
      Travis.Urls.builds(@getPath('repository.slug'))
    ).property('repository.slug')

    urlPullRequests: (->
      Travis.Urls.pullRequests(@getPath('repository.slug'))
    ).property('repository.slug')

    urlBranches: (->
      Travis.Urls.branches(@getPath('repository.slug'))
    ).property('repository.slug')

    urlBuild: (->
      Travis.Urls.build(@getPath('repository.slug'), @getPath('build.id'))
    ).property('repository.slug', 'build.id')

    urlJob: (->
      Travis.Urls.job(@getPath('repository.slug'), @getPath('job.id'))
    ).property('repository.slug', 'job.id')

    urlStatusImage: (->
      Travis.Urls.statusImage(@getPath('repository.slug'), @getPath('branch.commit.branch'))
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






