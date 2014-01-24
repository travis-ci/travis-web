require 'travis/model'

@Travis.Annotation = Travis.Model.extend
  jobId:        Ember.attr('number')
  description:  Ember.attr('string')
  url:          Ember.attr('string')
  status:       Ember.attr('string')
  providerName: Ember.attr('string')

  job: Ember.belongsTo('Travis.Job')
