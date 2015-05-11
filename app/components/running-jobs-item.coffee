`import Ember from 'ember'`
`import Polling from 'travis/mixins/polling'`

RunningJobsItemComponent = Ember.Component.extend(Polling,
  pollModels: 'job'
)

`export default RunningJobsItemComponent`
