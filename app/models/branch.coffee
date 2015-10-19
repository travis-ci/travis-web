`import Ember from 'ember'`
`import Model from 'travis/models/model'`

Branch = Model.extend
  lastBuild: DS.belongsTo('build')

`export default Branch`
