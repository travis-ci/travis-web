`import Ember from 'ember'`
`import Model from 'travis/models/model'`

Account = Model.extend
  name:         DS.attr()
  type:         DS.attr()
  reposCount:   DS.attr('number')
  subscribed:   DS.attr('boolean')
  education:    DS.attr('boolean')
  loginBinding: 'id'

`export default Account`
