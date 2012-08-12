require 'travis/model'

@Travis.Worker = Travis.Model.extend
  state: DS.attr('string')
  name: DS.attr('string')
  host: DS.attr('string')
  lastSeenAt: DS.attr('string')

  payload: (->
    @get('data.payload')
  ).property('data.payload')

  number: (->
    @get('name').match(/\d+$/)[0]
  ).property('name')

  display: (->
    name    = @get('name')
    state   = @get('state')
    payload = @get('payload')
    if name
      name = name.replace('travis-', '')
      if state == 'working' && payload != undefined
        repo   = if payload.repository then $.truncate(payload.repository.slug, 18) else undefined
        number = if payload.build and payload.build.number then ' #' + payload.build.number else ''
        state  = if repo then repo + number else state
      name + ': ' + state
  ).property('state', 'name', 'payload')

  urlJob: (->
    "/#{@get('repository')}/jobs/#{@get('job_id')}" if @get('state') == 'working'
  ).property('repository', 'job_id', 'state')

  repository: (->
    @get('payload.repository.slug')
  ).property('payload.repository.slug')

  job_id: (->
    @get('payload.job.id')
  ).property('payload.job.id')
