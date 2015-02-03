`import { colorForState } from 'travis/utils/helpers'`
`import BasicView from 'travis/views/basic'`

View = BasicView.extend
  classNameBindings: ['color', 'loading']
  buildBinding: 'controller.build'
  loadingBinding: 'controller.loading'

  color: (->
    colorForState(@get('build.state'))
  ).property('build.state')

`export default View`
