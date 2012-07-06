Travis.SidebarController = Em.ArrayController.extend
  init: ->
    @tickables = []
    Travis.Ticker.create(target: this, interval: Travis.INTERVALS.sponsors)

    @connectWorkers(Travis.Worker.find())
    @connectQueues(Travis.QUEUES)

    @connectSponsors('decks', Travis.Sponsor.decks(), 1)
    @connectSponsors('links', Travis.Sponsor.links(), 6)

  connectSponsors: (name, sponsors, perPage) ->
    controller = Travis.SponsorsController.create(perPage: perPage, content: sponsors)
    viewClass = Em.View.extend(templateName: "sponsors/#{name}")
    @connectOutlet(outletName: name, controller: controller, viewClass: viewClass)
    @tickables.push(controller)

  connectWorkers: (workers) ->
    controller = Travis.WorkersController.create(content: workers)
    viewClass = Em.View.extend(templateName: 'workers/list')
    @connectOutlet(outletName: 'workers', controller: controller, viewClass: viewClass)

  connectQueues: (queues) ->
    queues = for queue in queues
      Em.ArrayController.create
        content: Travis.Job.queued(queue.name)
        name: queue.display
    controller = Travis.QueuesController.create(content: queues)
    viewClass = Em.View.extend(templateName: 'queues/list')
    @connectOutlet(outletName: 'queues', controller: controller, viewClass: viewClass)

  tick: ->
    tickable.tick() for tickable in @tickables


