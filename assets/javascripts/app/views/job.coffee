@Travis.reopen
  JobsView: Em.View.extend
    templateName: 'jobs/list'
    buildBinding: 'controller.build'

    toggleHelp: ->
      $.facebox(div: '#allow_failure_help')

  JobsItemView: Em.View.extend
    repositoryBinding: 'context.repository'
    jobBinding: 'context'

    color: (->
      Travis.Helpers.colorForResult(@get('job.result'))
    ).property('job.result')

    urlJob: (->
      Travis.Urls.job(@get('repository.slug'), @get('job.id'))
    ).property('repository.slug', 'job.id')

  JobView: Em.View.extend
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

  LogView: Em.View.extend
    templateName: 'jobs/log'

    click: (event) ->
      $(event.target).closest('.fold').toggleClass('open')

