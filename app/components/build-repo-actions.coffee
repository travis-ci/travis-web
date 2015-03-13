`import Ember from 'ember'`
`import RepoActionsItemComponentMixin from 'travis/utils/repo-actions-item-component-mixin'`

BuildRepoActionsComponent = Ember.Component.extend(RepoActionsItemComponentMixin,
  item: Ember.computed.alias('build')
  type: 'build'
)

`export default BuildRepoActionsComponent`
