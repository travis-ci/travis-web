`import DS from 'ember-data'`

Store = DS.Store.extend
  defaultAdapter: 'application'
  adapter: 'application'

  receivePusherEvent: (event, data) ->
    [name, type] = event.split(':')

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
