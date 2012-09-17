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

  isWorking: (->
    @get('state') == 'working'
  ).property('state')

  urlJob: (->
    "/#{@get('repository')}/jobs/#{@get('job_id')}" if @get('state') == 'working'
  ).property('repository', 'job_id', 'state')

  repository: (->
    @get('payload.repository.slug')
  ).property('payload.repository.slug')

  job_id: (->
    @get('payload.job.id')
  ).property('payload.job.id')
