require 'travis/model'

Model = Travis.Model

Account = Model.extend
  name:         DS.attr()
  type:         DS.attr()
  reposCount:   DS.attr('number')
  subscribed:   DS.attr('boolean')
  education:    DS.attr('boolean')
  loginBinding: 'id'

Travis.Account = Account
