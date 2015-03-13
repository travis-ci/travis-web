`import Ember from 'ember'`
`import RepoActionsItemComponentMixin from 'travis/utils/repo-actions-item-component-mixin'`

JobRepoActionsComponent = Ember.Component.extend(RepoActionsItemComponentMixin,
  item: Ember.computed.alias('job')
  type: 'job'
)

`export default JobRepoActionsComponent`
