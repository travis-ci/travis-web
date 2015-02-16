`import { statusImage } from 'travis/utils/urls'`
`import StatusImagesView from 'travis/views/status-images'`
`import BasicView from 'travis/views/basic'`
`import config from 'travis/config/environment'`

View = BasicView.extend
  reposBinding: 'controllers.repos'
  repoBinding: 'controller.repo'
  buildBinding: 'controller.build'
  jobBinding: 'controller.job'
  tabBinding: 'controller.tab'

  classNameBindings: ['controller.isLoading:loading']

  isEmpty: (->
    @get('repos.isLoaded') && @get('repos.length') == 0
  ).property('repos.isLoaded', 'repos.length')

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

  ReposEmptyView: BasicView.extend
    template: (->
      if config.pro
        'pro/repos/show/empty'
      else
        ''
    ).property()

`export default View`
