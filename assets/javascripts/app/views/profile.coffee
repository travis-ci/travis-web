@Travis.reopen
  UserView: Travis.View.extend
    templateName: 'profile/show'

    userBinding: 'controller.user'

    gravatarUrl: (->
      "http://www.gravatar.com/avatar/#{@get('user.gravatar')}?s=48&d=mm"
    ).property('user.gravatar')

  HooksView: Travis.View.extend
    templateName: 'profile/hooks'

    urlGithubAdmin: (->
      Travis.Urls.githubAdmin(@get('hook.slug'))
    ).property('hook.slug')

