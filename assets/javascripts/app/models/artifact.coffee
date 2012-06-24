require 'travis/model'

@Travis.Artifact = Travis.Model.extend
  body: DS.attr('string')
