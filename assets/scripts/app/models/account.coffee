require 'travis/model'

Travis.Account = Travis.Model.extend
  name:         DS.attr()
  type:         DS.attr()
  reposCount:   DS.attr('number')
  subscribed:   DS.attr('boolean')
  education:    DS.attr('boolean')
  loginBinding: 'id'
