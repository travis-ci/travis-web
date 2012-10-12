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

  repo: (->
    Travis.Repo.find(@get('payload.repository.id') || @get('payload.repo.id'))
  ).property('payload.repository.id', 'payload.repo.id')

  job_id: (->
    @get('payload.job.id')
  ).property('payload.job.id')

  job: (->
    Travis.Job.find @get('job_id')
  ).property('job_id')

  nameForSort: (->
    if name = @get('name')
      match = name.match /(.*?)-(\d+)/
      if match
        name = match[1]
        id   = match[2].toString()
        if id.length < 2
          id = "00#{id}"
        else if id.length < 3
          id = "0#{id}"

        "#{name}-#{id}"
  ).property('name')
