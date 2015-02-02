BasicView = Travis.BasicView
githubAdminUrl = Travis.Urls.githubAdmin

View = BasicView.extend
  templateName: 'profile/tabs/hooks'
  userBinding: 'controller.user'

  urlGithubAdmin: (->
    githubAdminUrl(@get('hook.slug'))
  ).property('hook.slug')

HooksView = View
