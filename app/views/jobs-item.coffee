colorForState = Travis.Helpers.colorForState
BasicView = Travis.BasicView

View = BasicView.extend
    tagName: 'tr'
    classNameBindings: ['color']
    repoBinding: 'context.repo'
    jobBinding: 'context'

    color: (->
      colorForState(@get('job.state'))
    ).property('job.state')

Travis.JobsItemView = View
