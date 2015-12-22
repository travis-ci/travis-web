`import BasicView from 'travis/views/basic'`

View = BasicView.extend
  tabBinding: 'controller.tab'
  classNames: ['profile-orglist', 'columns', 'medium-4']
  tagName: 'aside'
  templateName: 'profile/accounts'

`export default View`
