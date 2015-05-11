`import Ember from 'ember'`
`import { colorForState } from 'travis/utils/helpers'`
`import Polling from 'travis/mixins/polling'`

View = Ember.CollectionView.extend
  elementId: ''
  tagName: 'ul'

  emptyView: Ember.View.extend
    templateName: 'repos-list/empty'

  itemViewClass: Ember.View.extend Polling,
    pollModels: 'repo'

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

`export default View`
