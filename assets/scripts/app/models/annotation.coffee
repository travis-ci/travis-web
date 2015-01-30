require 'models/model'

Model = Travis.Model

Annotation = Model.extend
  jobId:        DS.attr('number')
  description:  DS.attr()
  url:          DS.attr()
  status:       DS.attr()
  providerName: DS.attr()

  job: DS.belongsTo('job')

Travis.Annotation = Annotation
