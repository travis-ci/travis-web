require 'travis/model'

@Travis.Annotation = Travis.Model.extend
  jobId:        DS.attr('number')
  description:  DS.attr('string')
  url:          DS.attr('string')
  image:        DS.attr('object')
  providerName: DS.attr('string')

  job: DS.belongsTo('Travis.Job')
