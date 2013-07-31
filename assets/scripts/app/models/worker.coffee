require 'travis/model'

@Travis.Worker = Travis.Model.extend
  state: Ember.attr('string')
  name: Ember.attr('string')
  host: Ember.attr('string')
  payload: Ember.attr('object')

  number: (->
    @get('name').match(/\d+$/)[0]
  ).property('name')

  isWorking: (->
    @get('state') == 'working'
  ).property('state')

  jobId: (->
    @get('payload.build.id') || @get('payload.job.id')
  ).property('payload.job.id', 'payload.build.id')

  job: (->
    Travis.Job.find @get('job_id')
  ).property('jobId')

  jobNumber: (->
    @get('payload.job.number')
  ).property('jobNumber')

  repo: (->
    id = @get('payload.repository.id') || @get('payload.repo.id')
    slug = @get('repoSlug')

    @get('store').loadIncomplete(Travis.Repo, {
      id: id,
      slug: slug
    }, { skipIfExists: true })

    Travis.Repo.find(@get('payload.repository.id') || @get('payload.repo.id'))
  ).property('payload.repository.id', 'payload.repo.id')

  repoSlug: (->
    @get('payload.repo.slug') || @get('payload.repository.slug')
  ).property('payload.repo.slug', 'payload.repository.slug')

  repoId: (->
    @get('payload.repo.id') || @get('payload.repository.id')
  ).property('payload.repo.id', 'payload.repository.id')

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
