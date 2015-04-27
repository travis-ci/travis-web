`import { colorForState } from 'travis/utils/helpers'`
`import BasicView from 'travis/views/basic'`
`import Polling from 'travis/mixins/polling'`

View = BasicView.extend Polling,
  classNameBindings: ['color']
  buildBinding: 'controller.build'

  pollModels: 'controller.build'

  color: (->
    colorForState(@get('build.state'))
  ).property('build.state')

`export default View`
