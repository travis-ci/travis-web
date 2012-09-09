@Travis.reopen
  RepositoriesListView: Em.CollectionView.extend
    elementId: 'repositories'
    repositoryBinding: 'content'
    tagName: 'ul'

    emptyView: Ember.View.extend
      template: Ember.Handlebars.compile('<div class="loading"><span>Loading</span></div>')

    itemViewClass: Travis.View.extend
      repositoryBinding: 'content'
      classNames: ['repository']
      classNameBindings: ['color', 'selected']
      selectedBinding: 'repository.selected'

      color: (->
        Travis.Helpers.colorForResult(@get('repository.lastBuildResult'))
      ).property('repository.lastBuildResult')

      urlRepository: (->
        Travis.Urls.repository(@get('repository.slug'))
      ).property('repository.slug')

      urlLastBuild: (->
        Travis.Urls.build(@get('repository.slug'), @get('repository.lastBuildId'))
      ).property('repository.slug', 'repository.lastBuildId')
