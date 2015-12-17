`import DS from 'ember-data'`
`import Config from 'travis/config/environment'`

Store = DS.Store.extend
  auth: Ember.inject.service()

  defaultAdapter: 'application'
  adapter: 'application'

  init: ->
    @_super.apply(this, arguments)
    @set('pusherEventHandlerGuards', {})

  addPusherEventHandlerGuard: (name, callback) ->
    @get('pusherEventHandlerGuards')[name] = callback

  removePusherEventHandlerGuard: (name) ->
    delete @get('pusherEventHandlerGuards')[name]

  canHandleEvent: (event, data) ->
    [name, type] = event.split(':')

    for name, callback of @get('pusherEventHandlerGuards')
      unless callback(event, data)
        return false

    return true

  receivePusherEvent: (event, data) ->
    [name, type] = event.split(':')

    return unless @canHandleEvent(event, data)

    if name == 'job' && data.job?.commit
      @push(this.normalize('commit', data.job.commit))

    if name == 'build' && data.build?.commit
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

      @push(this.normalize('commit', commit))

    if event == 'job:log'
      data = data.job
      job = @recordForId('job', data.id)
      job.appendLog(number: parseInt(data.number), content: data._log, final: data.final)
    else if data[name]
      @loadOne(name, data)
    else
      throw "can't load data for #{name}" unless type

  loadOne: (type, json) ->
    record = @push(this.normalize(type, json))

    # we get other types of records only in a few situations and
    # it's not always needed to update data, so I'm specyfing which
    # things I want to update here:
    if type == 'build' && (json.repository || json.repo)
      data = json.repository || json.repo

      if Config.useV3API
        default_branch = data.default_branch
        if default_branch
          default_branch.default_branch = true

        last_build_id = default_branch.last_build_id
        # a build is a synchronous relationship on a branch model, so we need to
        # have a build record present when we put default_branch from a repository
        # model into the store. We don't send last_build's payload in pusher, so
        # we need to get it here, if it's not already in the store. In the future
        # we may decide to make this relationship async, but I don't want to
        # change the code at the moment
        if !last_build_id || (build = @peekRecord('build', last_build_id))
          @push(this.normalize('repo', data))
        else
          @findRecord('build', last_build_id).then =>
            @push(this.normalize('repo', data))
      else
        @push(this.normalize('repo', data))


`export default Store`
