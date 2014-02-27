unless window.TravisApplication
  window.TravisApplication = Em.Application.extend(Ember.Evented,
    LOG_TRANSITIONS: true,
    authState: Ember.computed.alias('auth.state')
    signedIn: (-> @get('authState') == 'signed-in' ).property('authState')

    mappings: (->
      broadcasts:   Travis.Broadcast
      repositories: Travis.Repo
      repository:   Travis.Repo
      repos:        Travis.Repo
      repo:         Travis.Repo
      builds:       Travis.Build
      build:        Travis.Build
      commits:      Travis.Commit
      commit:       Travis.Commit
      jobs:         Travis.Job
      job:          Travis.Job
      account:      Travis.Account
      accounts:     Travis.Account
      worker:       Travis.Worker
      workers:      Travis.Worker
      annotation:   Travis.Annotation
      annotations:  Travis.Annotation
      request:      Travis.Request
      requests:     Travis.Request
    ).property()

    modelClasses: (->
      [Travis.User, Travis.Build, Travis.Job, Travis.Repo, Travis.Commit, Travis.Worker, Travis.Account, Travis.Broadcast, Travis.Hook, Travis.Annotation, Travis.Request]
    ).property()

    setup: ->
      @get('modelClasses').forEach (klass) ->
        klass.adapter = Travis.Adapter.create()
        klass.url = "/#{klass.pluralName()}"

      @slider = new Travis.Slider()
      @pusher = new Travis.Pusher(Travis.config.pusher_key) if Travis.config.pusher_key
      @tailing = new Travis.Tailing($(window), '#tail', '#log')
      @toTop   = new Travis.ToTop($(window), '.to-top', '#log-container')

      @set('auth', Travis.Auth.create(app: this, endpoint: Travis.config.api_endpoint))

    reset: ->
      @_super.apply(this, arguments)
      @get('modelClasses').forEach (klass) ->
        klass.resetData()
      @setup()

    lookup: ->
      @__container__.lookup.apply @__container__, arguments

    flash: (options) ->
      Travis.lookup('controller:flash').loadFlashes([options])

    storeAfterSignInPath: (path) ->
      @get('auth').storeAfterSignInPath(path)

    autoSignIn: (path) ->
      @get('auth').autoSignIn()

    signIn: ->
      @get('auth').signIn()

    signOut: ->
      @get('auth').signOut()

    signingIn: (->
      Travis.get('authState') == 'signing-in'
    ).property('authState')

    receive: (event, data) ->
      [name, type] = event.split(':')

      type = Ember.get(Travis, 'mappings')[name]

      if event == 'build:started' && data.build.commit
        # TODO: commit should be a sideload record on build, not mixed with it
        build = data.build
        commit = {
          id:              build.commit_id
          author_email:    build.author_email
          author_name:     build.author_name
          branch:          build.branch
          committed_at:    build.committed_at
          committer_email: build.committer_email
          committer_name:  build.committer_name
          compare_url:     build.compare_url
          message:         build.message
          sha:             build.commit
        }
        delete(data.build.commit)
        @loadOrMerge(Travis.Commit, commit)


      if event == 'job:log'
        console.log 'store: received job:log event', data if Log.DEBUG
        data = data.job
        job  = Travis.Job.find(data.id)
        job.appendLog(number: parseInt(data.number), content: data._log, final: data.final)
      else if data[type.singularName()]
        @_loadOne(this, type, data)
      else if data[type.pluralName()]
        @_loadMany(this, type, data)
      else
        throw "can't load data for #{name}" unless type

    _loadOne: (store, type, json) ->
      root = type.singularName()
      reference = @loadOrMerge(type, json[root])
      unless reference.record
        type.loadRecordForReference(reference)

      # we get other types of records only in a few situations and
      # it's not always needed to update data, so I'm specyfing which
      # things I want to update here:
      if type == Travis.Build && (json.repository || json.repo)
        data = json.repository || json.repo
        reference = @loadOrMerge(Travis.Repo, data)
        unless reference.record
          Travis.Repo.loadRecordForReference(reference)

    loadOrMerge: (type, hash, options) ->
      options ||= {}

      reference = type._getReferenceById(hash.id)

      if reference && options.skipIfExists
        return

      reference = type._getOrCreateReferenceForId(hash.id)
      if reference.record
        reference.record.merge(hash)
      else
        if type.sideloadedData && type.sideloadedData[hash.id]
          Ember.merge(type.sideloadedData[hash.id], hash)
        else
          type.load([hash])

      reference

    toggleSidebar: ->
      $('body').toggleClass('maximized')
      # TODO gotta force redraws here :/
      element = $('<span></span>')
      $('#top .profile').append(element)
      Em.run.later (-> element.remove()), 10
      element = $('<span></span>')
      $('#repo').append(element)
      Em.run.later (-> element.remove()), 10

    ready: ->
      location.href = location.href.replace('#!/', '') if location.hash.slice(0, 2) == '#!'

    currentDate: ->
      new Date()
  )
