require 'views/repo/show/tabs'

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
