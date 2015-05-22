`import Ember from 'ember'`

ReposListComponent = Ember.Component.extend
  sortedRepos: Ember.computed.sort('repos', 'reposOrder')
  reposOrder: ['sortOrder:desc']

`export default ReposListComponent`
