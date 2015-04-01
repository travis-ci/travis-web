`import DS from 'ember-data'`
`import config from 'travis/config/environment'`

Store = DS.Store.extend
  defaultAdapter: 'application'
  adapter: 'application'

  init: ->
    @_super.apply(this, arguments)

    # we will let one start event every 5 seconds to populate some repos for
    # landing page
    setInterval =>
      @set('allowMoreLandingPageRepos', true)
    , 5000

  canHandleEvent: (event, data) ->
    if @get('isLandingPageOpened') && @get('allowMoreLandingPageRepos') && event == 'build:started'
      @set('allowMoreLandingPageRepos', false)
      return true

    auth = @container.lookup('auth:main')
    if !@get('isRecentTabOpen') && event != 'job:log' && auth.get('signedIn') &&
        !config.pro && !config.enterprise
      # if recent repos hasn't been opened yet, we can safely
      # drop any events that doesn't belong to repos owned by
      # the logged in user and that aren't related to any
      # repositories that are already opened

      permissions = auth.get('permissions')
      if name == 'job'
        id = data.job.repository_id
      else if name == 'build'
        id = data.repository.id

      return if !@hasRecordForId('repo', id) && !permissions.contains(id)

  receivePusherEvent: (event, data) ->
    [name, type] = event.split(':')

    return unless @canHandleEvent(event, data)

    if name == 'job' && data.job?.commit
      @pushPayload(commits: [data.job.commit])

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

      @pushPayload(commits: [commit])

    if event == 'job:log'
      data = data.job
      job = @recordForId('job', data.id)
      job.appendLog(number: parseInt(data.number), content: data._log, final: data.final)
    else if data[name]
      @_loadOne(name, data)
    else
      throw "can't load data for #{name}" unless type

  _loadOne: (type, json) ->
    payload = {}
    payload[type.pluralize()] = [json[type]]
    @pushPayload(payload)

    # we get other types of records only in a few situations and
    # it's not always needed to update data, so I'm specyfing which
    # things I want to update here:
    if type == 'build' && (json.repository || json.repo)
      data = json.repository || json.repo
      @pushPayload(repos: [data])



`export default Store`
