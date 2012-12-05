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

    didInsertElement: ->
      @_super.apply this, arguments
      @tryScrollingToHashLineNumber()

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

    logUrl: (->
      repo = @get('job.repo')
      item = @get('parentView.currentItem')

      if repo && item
        event = if item.constructor == Travis.Build
          'showBuild'
        else
          'showJob'

        Travis.app.get('router').urlForEvent(event, repo, item)
    ).property('job.repo', 'parentView.currentItem')

    PreView: Em.View.extend
      init: ->
        @_super.apply this, arguments
        @set 'logManager', Travis.Log.create(target: this)

      didInsertElement: ->
        @_super.apply this, arguments

        Ember.run.next this, ->
          if @get 'log.isInitialized'
            @logDidChange()

      willDestroy: ->
        @get('logManager').destroy()
        @get('log.parts').removeArrayObserver this,
          didChange: 'logContentsDidChange'
          willChange: 'logContentsWillChange'

      version: (->
        @rerender()
        @set 'logManager', Travis.Log.create(target: this)
      ).observes('log.version')

      logDidChange: (->
        if @get('log.isInitialized') && @state == 'inDOM'
          @attachLogObservers()
      ).observes('log', 'log.isInitialized')

      attachLogObservers: ->
        return if @get('logPartsObserversAttached') == Ember.guidFor(@get('log'))
        @set 'logPartsObserversAttached', Ember.guidFor(@get('log'))

        Ember.run.next this, ->
          @get('logManager').append @get('log.parts')

          @get('log.parts').addArrayObserver this,
            didChange: 'logContentsDidChange'
            willChange: 'logContentsWillChange'

      logContentsDidChange: (lines, index, removedCount, addedCount) ->
        addedLines = lines.slice(index, index + addedCount)
        @get('logManager').append addedLines

      logContentsWillChange: (-> )

      appendLog: (payloads) ->
        url = @get('logUrl')

        for payload in payloads
          line   = payload.content
          number = payload.number

          unless payload.append
            pathWithNumber = "#{url}#L#{number}"
            line = '<p><a href="%@" id="L%@" class="log-line-number" name="L%@">%@</a>%@</p>'.fmt(pathWithNumber, number, number, number, line)

          if payload.fold && !payload.foldContinuation
            line = "<div class='fold #{payload.fold} show-first-line'>#{line}</div>"

          if payload.replace
            this.$("#log #L#{number}").parent().replaceWith line
          else if payload.append
            this.$("#log #L#{number}").parent().append line
          else if payload.foldContinuation
            this.$("#log .fold.#{payload.fold}:last").append line
          else
            this.$('#log').append(line)

          if payload.openFold
            this.$("#log .fold.#{payload.openFold}:last").
              removeClass('show-first-line').
              addClass('open')

          if payload.foldEnd
            this.$("#log .fold.#{payload.fold}:last").removeClass('show-first-line')

