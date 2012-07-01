@Travis.Views.reopen
  ProfileView: Em.View.extend
    templateName: 'profile/show'

    gravatarUrl: (->
      "http://www.gravatar.com/avatar/#{@getPath('controller.user.gravatar')}?s=48&d=mm"
    ).property('controller.user.gravatar')


