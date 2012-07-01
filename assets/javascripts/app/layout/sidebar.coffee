require 'layout/base'

Travis.Layout.Sidebar = Travis.Layout.Base.extend
  name: 'sidebar'

  init: ->
    @_super('sponsors', 'workers', 'queues')
    @homeController = @get('homeController')

    @connectSponsors(Travis.Sponsor.decks(), Travis.Sponsor.links())
    @connectWorkers(Travis.Worker.find())
    @connectQueues(Travis.QUEUES)

    Travis.Ticker.create(target: this, interval: Travis.INTERVALS.sponsors)

  connect: ->
    @homeController.connectOutlet(outletName: 'right', name: 'sidebar')

  connectSponsors: (decks, links) ->
    @sponsorsController = Em.Controller.create
      decks: Travis.Controllers.SponsorsController.create(perPage: 1, content: decks)
      links: Travis.Controllers.SponsorsController.create(perPage: 6, content: links)
    @homeController.set 'sponsors', @sponsorsController

  tick: ->
    @sponsorsController.get('decks').next()
    @sponsorsController.get('links').next()

  connectWorkers: (workers) ->
    @workersController.set('content', workers)
    @homeController.set('workers', @workersController)

  connectQueues: (queues) ->
    queues = for queue in queues
      Em.ArrayController.create
        content: Travis.Job.queued(queue.name)
        name: queue.display
    @queuesController.set('content', queues)
    @homeController.set('queues', @queuesController)

