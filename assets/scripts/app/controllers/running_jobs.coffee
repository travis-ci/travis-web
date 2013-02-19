Travis.RunningJobsController = Em.ArrayProxy.extend
  Group: Em.Object.extend
    repo: (-> @get('jobs.firstObject.repo') ).property('jobs.firstObject.repo')

    init: ->
      @set 'jobs', []

      @set 'sortedJobs', Em.ArrayProxy.extend(Em.SortableMixin,
        sortProperties: ['number']
      ).create(content: @get('jobs'))

    add: (job) ->
      @get('jobs').pushObject(job) unless @get('jobs').contains job
      @attach()

    remove: (job) ->
      @get('jobs').removeObject(job)
      @clean()

    attach: ->
      @get('parent').addGroup(this)

    clean: ->
      @get('parent').removeGroup(this) if @get('isEmpty')

    isEmpty: (->
      @get('jobs.length') == 0
    ).property('jobs.length')

  groups: []
  sortedGroups: (->
    Em.ArrayProxy.extend(Em.SortableMixin,
      sortProperties: ['slug']
    ).create(content: @get('groups'))
  ).property()

  groupsBySlug: {}

  init: ->
    @_super.apply this, arguments

    jobs = Travis.Job.running()
    @set 'content', jobs
    @addedJobs jobs

  contentArrayWillChange: (array, index, removedCount, addedCount) ->
    @_super.apply this, arguments

    if removedCount
      @removedJobs array.slice(index, index + removedCount)

  contentArrayDidChange: (array, index, removedCount, addedCount) ->
    @_super.apply this, arguments

    if addedCount
      @addedJobs array.slice(index, index + addedCount)

  addedJobs: (jobs) ->
    self = this
    jobs.forEach (job) ->
      self.waitForSlug(job, 'addJob')

  removedJobs: (jobs) ->
    self = this
    jobs.forEach (job) ->
      self.waitForSlug(job, 'removeJob')

  addJob: (job) ->
    slug = job.get('repoSlug')
    group = @groupForSlug(slug)
    group.add(job)

  removeJob: (job) ->
    slug = job.get('repoSlug')
    group = @groupForSlug(slug)
    group.remove(job)

  waitForSlug: (job, callbackName) ->
    callback = @[callbackName]
    self = this
    if job.get('repoSlug')?
      callback.call self, job
    else
      observer = ->
        if job.get('repoSlug')?
          callback.call self, job
          job.removeObserver 'repoSlug', observer
      job.addObserver 'repoSlug', observer

  groupForSlug: (slug) ->
    @groupsBySlug[slug] ||= @Group.create(slug: slug, parent: this)

  addGroup: (group) ->
    @get('groups').pushObject group unless @get('groups').contains group

  removeGroup: (group) ->
    @get('groups').removeObject group
    delete @groupsBySlug[group.get('slug')]
