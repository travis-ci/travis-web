@Travis.reopen
  JobsView: Travis.View.extend
    templateName: 'jobs/list'
    buildBinding: 'controller.build'

  JobsItemView: Travis.View.extend
    tagName: 'tr'
    classNameBindings: ['color']
    repoBinding: 'context.repo'
    jobBinding: 'context'

    color: (->
      Travis.Helpers.colorForResult(@get('job.result'))
    ).property('job.result')

    urlJob: (->
      Travis.Urls.job(@get('repo.slug'), @get('job.id'))
    ).property('repo.slug', 'job.id')

  JobView: Travis.View.extend
    templateName: 'jobs/show'

    repoBinding: 'controller.repo'
    jobBinding: 'controller.job'
    commitBinding: 'job.commit'

    color: (->
      Travis.Helpers.colorForResult(@get('job.result'))
    ).property('job.result')

    urlJob: (->
      Travis.Urls.job(@get('repo.slug'), @get('job.id'))
    ).property('repo.slug', 'job.id')

    urlGithubCommit: (->
      Travis.Urls.githubCommit(@get('repo.slug'), @get('commit.sha'))
    ).property('repo.slug', 'commit.sha')

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

    toTop: () ->
      $(window).scrollTop(0)

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
