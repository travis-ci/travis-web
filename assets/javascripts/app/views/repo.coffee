@Travis.Views.reopen
  RepositoriesView: Em.View.extend
    templateName: 'repositories/list'

  RepositoriesItemView: Em.View.extend
    classes: (->
      $.compact(['repository', @get('color'), @get('selected')]).join(' ')
    ).property('context.lastBuildResult', 'context.selected')

    color: (->
      Travis.Helpers.colorForResult(@getPath('context.lastBuildResult'))
    ).property('context.lastBuildResult')

    selected: (->
      'selected' if @getPath('context.selected')
    ).property('context.selected')

    urlRepository: (->
      Travis.Urls.repository(@get('context'))
    ).property('context')

    urlLastBuild: (->
      Travis.Urls.lastBuild(@get('context'))
    ).property('context')

  RepositoryView: Em.View.extend
    templateName: 'repositories/show'


