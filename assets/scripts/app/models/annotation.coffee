require 'travis/model'

@Travis.Annotation = Travis.Model.extend
  jobId:        Ember.attr('number')
  description:  Ember.attr('string')
  url:          Ember.attr('string')
  image:        Ember.attr('object')
  providerName: Ember.attr('string')

  job: Ember.belongsTo('Travis.Job')
