Travis.reopen
  SidebarController: Em.ArrayController.extend
    needs: ['runningJobs']
    jobsBinding: 'controllers.runningJobs'

    init: ->
      @_super.apply this, arguments

  QueuesController: Em.ArrayController.extend
    init: ->
      @_super.apply this, arguments

      queues = for queue in Travis.QUEUES
        Travis.LimitedArray.create
          content: Travis.Job.queued(queue.name), limit: 20
          id: "queue_#{queue.name}"
          name: queue.display
      @set 'content', queues

    showAll: (queue) ->
      queue.showAll()

  WorkersController: Em.ArrayController.extend
    init: ->
      @_super.apply this, arguments
      @set 'content', Travis.Worker.find()

    groups: (->
      if content = @get 'arrangedContent'
        groups = {}
        for worker in content.toArray()
          host = worker.get('host')
          unless groups[host]
            groups[host] = Em.ArrayProxy.extend(Em.SortableMixin,
              content: [],
              sortProperties: ['nameForSort']
            ).create()
          groups[host].pushObject(worker)

        $.values(groups)
    ).property('length')
