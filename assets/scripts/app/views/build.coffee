Travis.reopen
  BuildsView: Travis.View.extend
    templateName: 'builds/list'
    buildsBinding: 'controller.builds'

    ShowMoreButton: Em.View.extend
      tagName: 'button'
      classNameBindings: ['isLoading', 'showMore']
      showMore: true
      attributeBindings: ['disabled']
      isLoadingBinding: 'controller.isLoading'
      template: Em.Handlebars.compile('{{view.label}}')

      disabledBinding: 'isLoading'

      label: (->
        if @get('isLoading') then 'Loading' else 'Show more'
      ).property('isLoading')

      click: ->
        @get('controller').showMore()

  BuildsItemView: Travis.View.extend
    tagName: 'tr'
    classNameBindings: ['color']
    repoBinding: 'controller.repo'
    buildBinding: 'context'
    commitBinding: 'build.commit'

    isPullRequestsList: ( -> @get('parentView.isPullRequestsList') ).property('parentView.isPullRequestsList')

    color: (->
      Travis.Helpers.colorForState(@get('build.state'))
    ).property('build.state')

  BuildView: Travis.View.extend
    templateName: 'builds/show'
    classNameBindings: ['color', 'loading']
    buildBinding: 'controller.build'
    commitBinding: 'build.commit'

    urlCommitterGravatarImage: (->
      Travis.Urls.gravatarImage(@get('commit.committerEmail'), 40)
    ).property('commit.committerEmail')

    urlAuthorGravatarImage: (->
      Travis.Urls.gravatarImage(@get('commit.authorEmail'), 40)
    ).property('commit.authorEmail')

    loadingBinding: 'controller.loading'

    color: (->
      Travis.Helpers.colorForState(@get('build.state'))
    ).property('build.state')
