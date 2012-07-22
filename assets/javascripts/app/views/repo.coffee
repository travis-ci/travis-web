@Travis.reopen
  RepositoriesView: Travis.View.extend
    templateName: 'repos/list'
    tabBinding: 'controller.tab'

    classRecent: (->
      'active' if @get('tab') == 'recent'
    ).property('tab')

    classOwned: (->
      classes = []
      classes.push('active')  if @get('tab') == 'owned'
      classes.push('display') if Em.get('Travis.currentUser')
      classes.join(' ')
    ).property('tab', 'Travis.currentUser')

    classSearch: (->
      'active' if @get('tab') == 'search'
    ).property('tab')

  RepositoriesItemView: Travis.View.extend
    repositoryBinding: 'context'

    classes: (->
      $.compact(['repository', @get('color'), @get('selected')]).join(' ')
    ).property('color', 'selected')

    color: (->
      Travis.Helpers.colorForResult(@get('repository.lastBuildResult'))
    ).property('repository.lastBuildResult')

    selected: (->
      'selected' if @get('repository.selected')
    ).property('repository.selected')

    urlRepository: (->
      Travis.Urls.repository(@get('repository.slug'))
    ).property('repository.slug')

    urlLastBuild: (->
      Travis.Urls.build(@get('repository.slug'), @get('repository.lastBuildId'))
    ).property('repository.slug', 'repository.lastBuildId')

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
