`import Ember from 'ember'`
`import Model from 'travis/models/model'`

Branch = Model.extend
  name: DS.attr('string')
  defaultBranch: DS.attr('boolean')

  lastBuild: DS.belongsTo('build')
  builds: DS.hasMany('builds', inverse: 'branch')
  repo:   DS.belongsTo('repo', inverse: 'defaultBranch')

`export default Branch`
