`import { statusImage } from 'travis/utils/urls'`
`import StatusImagesView from 'travis/views/status-images'`
`import BasicView from 'travis/views/basic'`
`import config from 'travis/config/environment'`
`import Polling from 'travis/mixins/polling'`

View = BasicView.extend Polling,
  repoBinding: 'controller.repo'

  pollModels: 'controller.repo'

  classNameBindings: ['controller.isLoading:loading']

  statusImageUrl: (->
    statusImage(@get('controller.repo.slug'))
  ).property('controller.repo.slug')

  actions:
    statusImages: () ->
      @popupCloseAll()
      view = StatusImagesView.create(toolsView: this, container: @container)
      BasicView.currentPopupView = view
      view.appendTo($('body'))
      return false

`export default View`
