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
      Travis.Helpers.colorForResult(@getPath('job.result'))
    ).property('job.result')

    urlJob: (->
      Travis.Urls.job(@getPath('repository.slug'), @getPath('job.id'))
    ).property('repository.slug', 'job.id')

  JobView: Em.View.extend
    templateName: 'jobs/show'

    repositoryBinding: 'controller.repository'
    jobBinding: 'controller.job'
    commitBinding: 'job.commit'

    color: (->
      Travis.Helpers.colorForResult(@getPath('job.result'))
    ).property('job.result')

    urlJob: (->
      Travis.Urls.job(@getPath('repository.slug'), @getPath('job.id'))
    ).property('repository.slug', 'job.id')

    urlGithubCommit: (->
      Travis.Urls.githubCommit(@getPath('repository.slug'), @getPath('commit.sha'))
    ).property('repository.slug', 'commit.sha')

    urlAuthor: (->
      Travis.Urls.email(@getPath('commit.authorEmail'))
    ).property('commit.authorEmail')

    urlCommitter: (->
      Travis.Urls.email(@getPath('commit.committerEmail'))
    ).property('commit.committerEmail')

  LogView: Em.View.extend
    templateName: 'jobs/log'

    click: (event) ->
      $(event.target).closest('.fold').toggleClass('open')

