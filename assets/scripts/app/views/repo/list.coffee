@Travis.reopen
  ReposView: Travis.View.extend
    templateName: 'repos/list'

  ReposListView: Em.CollectionView.extend
    elementId: 'repos'
    tagName: 'ul'

    emptyView: Ember.View.extend
      template: Ember.Handlebars.compile('<div class="loading"><span>Loading</span></div>')

    itemViewClass: Travis.View.extend
      repoBinding: 'content'
      classNames: ['repo']
      classNameBindings: ['color', 'selected']
      selected: (->
        @get('content') == @get('controller.selectedRepo')
      ).property('controller.selectedRepo')

      color: (->
        Travis.Helpers.colorForState(@get('repo.lastBuildState'))
      ).property('repo.lastBuildState')

  ReposListTabsView: Travis.View.extend
    templateName: 'repos/list/tabs'
    tabBinding: 'controller.tab'
    currentUserBinding: 'controller.currentUser.id'

    activate: (name) ->
      @get('controller').transitionToRoot()
      @get('controller').activate(name)

    classRecent: (->
      'active' if @get('tab') == 'recent'
    ).property('tab')

    classOwned: (->
      classes = []
      classes.push('active')  if @get('tab') == 'owned'
      classes.push('display-inline') if @get('currentUser')
      classes.join(' ')
    ).property('tab', 'currentUser')

    classSearch: (->
      'active' if @get('tab') == 'search'
    ).property('tab')
