require 'travis/model'

Travis.EnvVar = Travis.Model.extend
  name:   DS.attr()
  value:  DS.attr()
  public: DS.attr('boolean')

  repo: DS.belongsTo('repo', async: true)
