`import BasicView from 'travis/views/basic'`
`import { githubAdmin as githubAdminUrl } from 'travis/utils/urls'`

View = BasicView.extend
  templateName: 'profile/tabs/hooks'
  userBinding: 'controller.user'

  urlGithubAdmin: (->
    githubAdminUrl(@get('hook.slug'))
  ).property('hook.slug')

`export default View`
