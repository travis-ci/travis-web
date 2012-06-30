require 'layout/base'

Travis.Layout.Sidebar = Travis.Layout.Base.extend
  init: ->
    @_super('sidebar', 'workers', 'queues')
    @appController = @get('appController')
    @connectWorkers(Travis.Worker.find())
    @connectQueues(Travis.QUEUES)

  connect: ->
    @appController.connectOutlet(outletName: 'right', name: 'sidebar')

  connectWorkers: (workers) ->
    @workersController.set('content', workers)
    @appController.set('workers', @workersController)

  connectQueues: (queues) ->
    queues = for queue in queues
      Em.ArrayController.create
        content: Travis.Job.queued(queue.name)
        name: queue.display
    @queuesController.set('content', queues)
    @appController.set('queues', @queuesController)

