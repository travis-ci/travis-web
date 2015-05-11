`import BasicView from 'travis/views/basic'`
`import Polling from 'travis/mixins/polling'`

View = BasicView.extend Polling,
  pollHook: (store) ->
    @get('controller.store').find('job', {})

`export default View`
