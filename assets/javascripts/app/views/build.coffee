@Travis.reopen
  BuildsView: Travis.View.extend
    templateName: 'builds/list'
    buildsBinding: 'controller'

    showMore: ->
      id = @get('controller.repository.id')
      number = @get('controller.builds.lastObject.number')
      Travis.Build.olderThanNumber(id, number)

  BuildsItemView: Travis.View.extend
    tagName: 'tr'
    classNameBindings: ['color']
    repositoryBinding: 'controller.repository'
    buildBinding: 'context'
    commitBinding: 'build.commit'

    color: (->
      Travis.Helpers.colorForResult(@get('build.result'))
    ).property('build.result')

    urlBuild: (->
      Travis.Urls.build(@get('repository.slug'), @get('build.id'))
    ).property('repository.slug', 'build.id')

    urlGithubCommit: (->
      Travis.Urls.githubCommit(@get('repository.slug'), @get('commit.sha'))
    ).property('repository.slug', 'commit.sha')

  BuildView: Travis.View.extend
    templateName: 'builds/show'
    elementId: 'build'
    classNameBindings: ['color', 'loading']

    repositoryBinding: 'controller.repository'
    buildBinding: 'controller.build'
    commitBinding: 'build.commit'

    loading: (->
      !@get('build.isLoaded')
    ).property('build.isLoaded')

    color: (->
      Travis.Helpers.colorForResult(@get('build.result'))
    ).property('build.result')

    urlBuild: (->
      Travis.Urls.build(@get('repository.slug'), @get('build.id'))
    ).property('repository.slug', 'build.id')

    urlGithubCommit: (->
      Travis.Urls.githubCommit(@get('repository.slug'), @get('commit.sha'))
    ).property('repository.slug', 'commit.sha')

    urlAuthor: (->
      Travis.Urls.email(@get('commit.authorEmail'))
    ).property('commit.authorEmail')

    urlCommitter: (->
      Travis.Urls.email(@get('commit.committerEmail'))
    ).property('commit.committerEmail')

