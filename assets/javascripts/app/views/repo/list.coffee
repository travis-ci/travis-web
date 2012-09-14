@Travis.reopen
  RepositoriesView: Travis.View.extend
    templateName: 'repos/list'

  RepositoriesListView: Em.CollectionView.extend
    elementId: 'repositories'
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

  ReposListTabsView: Travis.View.extend
    templateName: 'repos/list/tabs'
    tabBinding: 'controller.tab'

    activate: (event) ->
      @get('controller').activate(event.target.name)

    classRecent: (->
      'active' if @get('tab') == 'recent'
    ).property('tab')

    classOwned: (->
      classes = []
      classes.push('active')  if @get('tab') == 'owned'
      classes.push('display') if Travis.app.get('currentUser')
      classes.join(' ')
    ).property('tab', 'Travis.app.currentUser')

    classSearch: (->
      'active' if @get('tab') == 'search'
    ).property('tab')
