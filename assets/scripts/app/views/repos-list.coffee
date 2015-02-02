colorForState = Travis.Helpers.colorForState

View = Em.CollectionView.extend
  elementId: 'repos'
  tagName: 'ul'

  emptyView: Ember.View.extend
    template: Ember.Handlebars.compile('<div class="loading"><span>Loading</span></div>')

  itemViewClass: Travis.BasicView.extend
    repoBinding: 'content'
    classNames: ['repo']
    classNameBindings: ['color', 'selected']
    selected: (->
      @get('content') == @get('controller.selectedRepo')
    ).property('controller.selectedRepo')

    color: (->
      colorForState(@get('repo.lastBuildState'))
    ).property('repo.lastBuildState')

    click: ->
      @get('controller').transitionToRoute('/' + @get('repo.slug'))

Travis.ReposListView = View
