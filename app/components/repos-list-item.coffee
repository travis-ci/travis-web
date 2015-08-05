`import Ember from 'ember'`
`import Polling from 'travis/mixins/polling'`
`import { colorForState } from 'travis/utils/helpers'`

ReposListItemComponent = Ember.Component.extend Polling,
  tagName: 'li'

  pollModels: 'repo'

  classNames: ['repo']
  classNameBindings: ['color', 'selected']
  selected: (->
    @get('repo') == @get('selectedRepo')
  ).property('selectedRepo')

  color: (->
    colorForState(@get('repo.lastBuildState'))
  ).property('repo.lastBuildState')

  scrollTop: (->
    if (window.scrollY > 0)
      $('html, body').animate({scrollTop: 0}, 200)
  )

  click: ->
    @scrollTop()
    @get('controller').transitionToRoute('/' + @get('repo.slug'))

`export default ReposListItemComponent`
