`import BasicView from 'travis/views/basic'`
`import { colorForState } from 'travis/utils/helpers'`

View = BasicView.extend
    tagName: 'tr'
    classNameBindings: ['color']
    repoBinding: 'context.repo'
    jobBinding: 'context'

    color: (->
      colorForState(@get('job.state'))
    ).property('job.state')

`export default View`
