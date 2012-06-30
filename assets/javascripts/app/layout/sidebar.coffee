require 'layout/base'

Travis.Layout.Sidebar = Travis.Layout.Base.extend
  init: ->
    @_super('sidebar', 'sponsors', 'workers', 'queues')
    @appController = @get('appController')

    @connectSponsors(Travis.Sponsor.decks(), Travis.Sponsor.links())
    @connectWorkers(Travis.Worker.find())
    @connectQueues(Travis.QUEUES)

    Travis.Ticker.create(target: this, interval: Travis.INTERVALS.sponsors)

  connect: ->
    @appController.connectOutlet(outletName: 'right', name: 'sidebar')

  connectSponsors: (decks, links) ->
    @sponsorsController = Em.Controller.create
      decks: Travis.Controllers.SponsorsController.create(perPage: 1, content: decks)
      links: Travis.Controllers.SponsorsController.create(perPage: 6, content: links)
    @appController.set 'sponsors', @sponsorsController

  tick: ->
    @sponsorsController.get('decks').next()
    @sponsorsController.get('links').next()

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

