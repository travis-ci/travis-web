require 'travis/model'

Travis.EnvVar = Travis.Model.extend
  name: Ember.attr('string')
  value: Ember.attr('string')
  public: Ember.attr('boolean')

  repo: Ember.belongsTo('Travis.Repo', key: 'repository_id')
