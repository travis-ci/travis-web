Travis.reopen
  BuildsView: Travis.View.extend
    templateName: 'builds/list'
    buildsBinding: 'controller.builds'

    isPullRequestsList: (->
      @get('controller.tab') == 'pull_requests'
    ).property('controller.tab')

    ShowMoreButton: Em.View.extend
      tagName: 'button'
      classNameBindings: ['isLoading']
      attributeBindings: ['disabled']
      isLoadingBinding: 'controller.isLoading'
      template: Em.Handlebars.compile('{{view.label}}')

      disabledBinding: 'isLoading'

      label: (->
        if @get('isLoading') then 'Loading' else 'Show more'
      ).property('isLoading')

      click: ->
        @get('controller').showMore()

  BuildsItemView: Travis.View.extend
    tagName: 'tr'
    classNameBindings: ['color']
    repoBinding: 'controller.repo'
    buildBinding: 'context'
    commitBinding: 'build.commit'

    isPullRequestsList: ( -> @get('parentView.isPullRequestsList') ).property('parentView.isPullRequestsList')

    color: (->
      Travis.Helpers.colorForState(@get('build.state'))
    ).property('build.state')

    urlGithubCommit: (->
      Travis.Urls.githubCommit(@get('repo.slug'), @get('commit.sha'))
    ).property('repo.slug', 'commit.sha')

    urlGithubPullRequest: (->
      Travis.Urls.githubPullRequest(@get('repo.slug'), @get('commit.pullRequestNumber'))
    ).property('repo.slug', 'commit.pullRequestNumber')

  BuildView: Travis.View.extend
    templateName: 'builds/show'
    classNameBindings: ['color', 'loading']

    loadingBinding: 'controller.loading'

    color: (->
      Travis.Helpers.colorForState(@get('controller.build.state'))
    ).property('controller.build.state')
