require 'travis/model'

Travis.Annotation = Travis.Model.extend
  jobId:        DS.attr('number')
  description:  DS.attr()
  url:          DS.attr()
  status:       DS.attr()
  providerName: DS.attr()

  job: DS.belongsTo('job')
