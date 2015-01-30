statusImage = Travis.Urls.statusImage
StatusImagesView = Travis.StatusImagesView
config = ENV.config

View = Travis.View.extend
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
      view = StatusImagesView.create(toolsView: this)
      Travis.View.currentPopupView = view
      view.appendTo($('body'))
      return false

  ReposEmptyView: Travis.View.extend
    template: (->
      if config.pro
        'pro/repos/show/empty'
      else
        ''
    ).property()

Travis.RepoView = View
