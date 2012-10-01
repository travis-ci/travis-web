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

  repository: (->
    Travis.Repository.find(@get('payload.repository.id'))
  ).property('payload.repository.id')

  job_id: (->
    @get('payload.job.id')
  ).property('payload.job.id')

  job: (->
    Travis.Job.find @get('job_id')
  ).property('job_id')
