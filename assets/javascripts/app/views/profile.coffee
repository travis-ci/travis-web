@Travis.Views.reopen
  UserView: Em.View.extend
    templateName: 'profile/show'

    gravatarUrl: (->
      "http://www.gravatar.com/avatar/#{@getPath('controller.content.gravatar')}?s=48&d=mm"
    ).property('controller.content.gravatar')

  HooksView: Em.View.extend
    templateName: 'profile/hooks'

