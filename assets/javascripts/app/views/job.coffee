@Travis.reopen
  JobsView: Travis.View.extend
    templateName: 'jobs/list'
    buildBinding: 'controller.build'

  JobsItemView: Travis.View.extend
    tagName: 'tr'
    classNameBindings: ['color']
    repositoryBinding: 'context.repository'
    jobBinding: 'context'

    color: (->
      Travis.Helpers.colorForResult(@get('job.result'))
    ).property('job.result')

    urlJob: (->
      Travis.Urls.job(@get('repository.slug'), @get('job.id'))
    ).property('repository.slug', 'job.id')

  JobView: Travis.View.extend
    templateName: 'jobs/show'

    repositoryBinding: 'controller.repository'
    jobBinding: 'controller.job'
    commitBinding: 'job.commit'

    color: (->
      Travis.Helpers.colorForResult(@get('job.result'))
    ).property('job.result')

    urlJob: (->
      Travis.Urls.job(@get('repository.slug'), @get('job.id'))
    ).property('repository.slug', 'job.id')

    urlGithubCommit: (->
      Travis.Urls.githubCommit(@get('repository.slug'), @get('commit.sha'))
    ).property('repository.slug', 'commit.sha')

    urlAuthor: (->
      Travis.Urls.email(@get('commit.authorEmail'))
    ).property('commit.authorEmail')

    urlCommitter: (->
      Travis.Urls.email(@get('commit.committerEmail'))
    ).property('commit.committerEmail')

  LogView: Travis.View.extend
    templateName: 'jobs/log'
    logBinding: 'job.log'

    click: (event) ->
      $(event.target).closest('.fold').toggleClass('open')

    jobBinding: 'context'

    toggleTailing: (event) ->
      Travis.app.tailing.toggle()
      event.preventDefault()

    logSubscriber: (->
      # for some reason observing context does not work,
      # TODO: find out why
      job   = @get('job')
      state = @get('job.state')
      if job && state != 'finished'
        job.subscribe()
      null
    ).property('job', 'job.state')
