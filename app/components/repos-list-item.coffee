`import Ember from 'ember'`
`import Polling from 'travis/mixins/polling'`
`import { colorForState } from 'travis/utils/helpers'`

ReposListItemComponent = Ember.Component.extend Polling,
  routing: Ember.inject.service('-routing')

  tagName: 'li'

  pollModels: 'repo'

  classNames: ['repo']
  classNameBindings: ['color', 'selected']
  selected: (->
    @get('repo') == @get('selectedRepo')
  ).property('selectedRepo')

  color: (->
    colorForState(@get('repo.defaultBranch.lastBuild.state'))
  ).property('repo.defaultBranch.lastBuild.state')

  scrollTop: (->
    if (window.scrollY > 0)
      $('html, body').animate({scrollTop: 0}, 200)
  )

  click: ->
    @scrollTop()
    @get('routing').transitionTo('repo', @get('repo.slug').split('/'))

`export default ReposListItemComponent`
