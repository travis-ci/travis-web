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

      click: ->
        @get('controller').transitionToRoute('/' + @get('repo.slug'))

  ReposListTabsView: Travis.View.extend
    templateName: 'repos/list/tabs'
    tabBinding: 'controller.tab'
    currentUserBinding: 'controller.currentUser.id'

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

    classNew: (->
      'display-inline' if @get('currentUser')
    ).property('currentUser')
