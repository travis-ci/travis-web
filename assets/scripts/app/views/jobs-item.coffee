View = Travis.View.extend
    tagName: 'tr'
    classNameBindings: ['color']
    repoBinding: 'context.repo'
    jobBinding: 'context'

    color: (->
      Travis.Helpers.colorForState(@get('job.state'))
    ).property('job.state')

Travis.JobsItemView = View
