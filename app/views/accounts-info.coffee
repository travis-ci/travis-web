`import BasicView from 'travis/views/basic'`

View = BasicView.extend
  templateName: 'profile/tabs/user'
  userBinding: 'controller.user'

  gravatarUrl: (->
    "#{location.protocol}//www.gravatar.com/avatar/#{@get('user.gravatarId')}?s=200&d=mm"
  ).property('user.gravatarId')

`export default View`
