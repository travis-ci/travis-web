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
      selectedBinding: 'repo.selected'

      color: (->
        Travis.Helpers.colorForState(@get('repo.lastBuildState'))
      ).property('repo.lastBuildState')

      urlRepo: (->
        Travis.Urls.repo(@get('repo.slug'))
      ).property('repo.slug')

      urlLastBuild: (->
        Travis.Urls.build(@get('repo.slug'), @get('repo.lastBuildId'))
      ).property('repo.slug', 'repo.lastBuildId')

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
      classes.push('display-inline') if Travis.app.get('currentUser')
      classes.join(' ')
    ).property('tab', 'Travis.app.currentUser')

    classSearch: (->
      'active' if @get('tab') == 'search'
    ).property('tab')

    toggleInfo: (event) ->
      $('#repos').toggleClass('open')
