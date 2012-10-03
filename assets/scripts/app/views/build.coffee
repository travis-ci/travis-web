@Travis.reopen
  BuildsView: Travis.View.extend
    templateName: 'builds/list'
    buildsBinding: 'controller.builds'

    showMore: ->
      id = @get('controller.repository.id')
      number = @get('builds.lastObject.number')
      @get('builds').load Travis.Build.olderThanNumber(id, number)

    ShowMoreButton: Em.View.extend
      tagName: 'button'
      classNameBindings: ['isLoading']
      attributeBindings: ['disabled']
      isLoadingBinding: 'controller.builds.isLoading'
      template: Em.Handlebars.compile('{{view.label}}')

      disabledBinding: 'isLoading'

      label: (->
        if @get('isLoading') then 'Loading' else 'Show more'
      ).property('isLoading')

      click: ->
        @get('parentView').showMore()

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

