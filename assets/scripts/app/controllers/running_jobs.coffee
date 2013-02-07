Travis.RunningJobsController = Em.ArrayProxy.extend
  Group: Em.Object.extend
    build: (-> @get('jobs.firstObject.build') ).property('jobs.firstObject.build')

    init: ->
      @set 'jobs', []

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
  groupsByBuildIds: {}

  init: ->
    @_super.apply this, arguments

    @addedJobs @get('content') if @get('content')

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
      buildId = job.get('buildId')
      group = self.groupForBuild(buildId)
      group.add(job)

  removedJobs: (jobs) ->
    self = this
    jobs.forEach (job) ->
      buildId = job.get('buildId')
      group = self.groupForBuild(buildId)
      group.remove(job)

  groupForBuild: (buildId) ->
    @groupsByBuildIds[buildId] ||= @Group.create(buildId: buildId, parent: this)

  addGroup: (group) ->
    @get('groups').pushObject group unless @get('groups').contains group

  removeGroup: (group) ->
    @get('groups').removeObject group
    delete @groupsByBuildIds[group.get('buildId')]
