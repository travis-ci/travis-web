Travis.Model = Model

SshKey = Model.extend
  value:       DS.attr()
  description: DS.attr()
  fingerprint: DS.attr()

Travis.SshKey = SshKey
