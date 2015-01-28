require 'travis/model'

Model = Travis.Model

EnvVar = Model.extend
  name:   DS.attr()
  value:  DS.attr()
  public: DS.attr('boolean')

  repo: DS.belongsTo('repo', async: true)

Travis.EnvVar = EnvVar
