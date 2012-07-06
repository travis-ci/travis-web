@Travis.Views.reopen
  UserView: Em.View.extend
    templateName: 'profile/show'

    userBinding: 'controller.user'

    gravatarUrl: (->
      "http://www.gravatar.com/avatar/#{@getPath('user.gravatar')}?s=48&d=mm"
    ).property('user.gravatar')

  HooksView: Em.View.extend
    templateName: 'profile/hooks'

    urlGithubAdmin: (->
      Travis.Urls.githubAdmin(@getPath('hook.slug'))
    ).property('hook.slug')

