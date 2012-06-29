@Travis.Views.reopen
  TabsView: Em.View.extend
    templateName: 'repositories/tabs'

    urlRepository: (->
      Travis.Urls.repository(@getPath('controller.repository'))
    ).property('controller.repository.id')

    urlBuilds: (->
      Travis.Urls.builds(@getPath('controller.repository'))
    ).property('controller.repository.id')

    urlBuild: (->
      Travis.Urls.build(@getPath('controller.repository'), @getPath('controller.build'))
    ).property('controller.repository.slug', 'controller.build.id')

    urlJob: (->
      Travis.Urls.job(@getPath('controller.repository'), @getPath('controller.job'))
    ).property('controller.repository.slug', 'controller.job.id')


