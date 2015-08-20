`import { statusImage } from 'travis/utils/urls'`
`import StatusImagesView from 'travis/views/status-images'`
`import BasicView from 'travis/views/basic'`
`import config from 'travis/config/environment'`
`import Polling from 'travis/mixins/polling'`

View = BasicView.extend Polling,
  popup: Ember.inject.service()
  reposBinding: 'reposController'
  repoBinding: 'controller.repo'
  buildBinding: 'controller.build'
  jobBinding: 'controller.job'
  tabBinding: 'controller.tab'

  pollModels: 'controller.repo'

  classNameBindings: ['controller.isLoading:loading']

  isEmpty: (->
    @get('repos.isLoaded') && @get('repos.length') == 0
  ).property('repos.isLoaded', 'repos.length')

  statusImageUrl: (->
    statusImage(@get('controller.repo.slug'))
  ).property('controller.repo.slug')

  actions:
    statusImages: () ->
      @get('popup').close()
      view = StatusImagesView.create(toolsView: this, container: @container)
      BasicView.currentPopupView = view
      view.appendTo($('body'))
      return false

`export default View`
