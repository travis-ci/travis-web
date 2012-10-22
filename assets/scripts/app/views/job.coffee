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

    currentItemBinding: 'job'

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

    scrollTo: (hash) ->
      # and this is even more weird, when changing hash in URL in firefox
      # to other value, for example #L10, it actually scrolls just #main
      # element... this is probably some CSS issue, I don't have time to
      # investigate at the moment
      # TODO: fix this
      $('#main').scrollTop 0

      # weird, html works in chrome, body in firefox
      $('html,body').scrollTop $(hash).offset().top

      @set 'controller.lineNumberHash', null

    lineNumberHashDidChange: (->
      @tryScrollingToHashLineNumber()
    ).observes('controller.lineNumberHash')

    tryScrollingToHashLineNumber: ->
      if hash = @get 'controller.lineNumberHash'
        self = this

        checker = ->
          return if self.get('isDestroyed')

          if $(hash).length
            self.scrollTo(hash)
          else
            setTimeout checker, 100

        checker()

    didInsertElement: ->
      @_super.apply this, arguments

      @tryScrollingToHashLineNumber()

    click: (event) ->
      target = $(event.target)

      target.closest('.fold').toggleClass('open')

      if target.is('.log-line-number')
        path = target.attr 'href'
        Travis.app.get('router').route(path)
        event.stopPropagation()
        return false

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
