`import Ember from 'ember'`
`import Model from 'travis/models/model'`

Annotation = Model.extend
  jobId:        DS.attr('number')
  description:  DS.attr()
  url:          DS.attr()
  status:       DS.attr()
  providerName: DS.attr()

  job: DS.belongsTo('job')

`export default Annotation`
