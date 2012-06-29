@Travis.Views.reopen
  RepositoriesView: Em.View.extend
    templateName: 'repositories/list'

  RepositoriesItemView: Em.View.extend
    classes: (->
      color   = Travis.Helpers.colorForResult(@getPath('repository.lastBuildResult'))
      classes = ['repository', color]
      classes.push 'selected' if @getPath('repository.selected')
      classes.join(' ')
    ).property('repository.lastBuildResult', 'repository.selected')

    urlRepository: (->
      Travis.Urls.repository(@get('context'))
    ).property('context')

    urlLastBuild: (->
      Travis.Urls.lastBuild(@get('context'))
    ).property('context')

  RepositoryView: Em.View.extend
    templateName: 'repositories/show'


