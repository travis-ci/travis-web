@Travis.reopen
  UserView: Em.View.extend
    templateName: 'profile/show'

    userBinding: 'controller.user'

    gravatarUrl: (->
      "http://www.gravatar.com/avatar/#{@get('user.gravatar')}?s=48&d=mm"
    ).property('user.gravatar')

  HooksView: Em.View.extend
    templateName: 'profile/hooks'

    urlGithubAdmin: (->
      Travis.Urls.githubAdmin(@get('hook.slug'))
    ).property('hook.slug')

