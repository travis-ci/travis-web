Travis.reopen
  SidebarController: Em.ArrayController.extend
    init: ->
      @tickables = []
      Travis.Ticker.create(target: this, interval: Travis.INTERVALS.sponsors)

      @toggle() if localStorage?.getItem('travis.maximized')

      @connectWorkers(Travis.Worker.find())
      @connectQueues(Travis.QUEUES)

      @connectSponsors('decks', Travis.Sponsor.decks(), 1)
      @connectSponsors('links', Travis.Sponsor.links(), 6)

    persist: ->
      localStorage?.setItem('travis.maximized', @isMinimized())

    isMinimized: ->
      return $('body').hasClass('maximized');

    toggle: ->
      $('body').toggleClass('maximized')
      @persist()
      # TODO gotta force redraws here :/
      element = $('<span></span>')
      $('#top .profile').append(element)
      Em.run.later (-> element.remove()), 10

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
          id: "queue_#{queue.name}"
          name: queue.display
      controller = Travis.QueuesController.create(content: queues)
      viewClass = Em.View.extend(templateName: 'queues/list')
      @connectOutlet(outletName: 'queues', controller: controller, viewClass: viewClass)

    tick: ->
      tickable.tick() for tickable in @tickables

  QueuesController: Em.ArrayController.extend()

  WorkersController: Em.ArrayController.extend
    groups: (->
      groups = {}
      for worker in @get('content').toArray()
        host = worker.get('host')
        groups[host] = Em.ArrayProxy.create(content: []) unless groups[host]
        groups[host].pushObject(worker)
      $.values(groups)
    ).property('content.length')

  SponsorsController: Em.ArrayController.extend
    page: 0

    arrangedContent: (->
      @get('shuffled').slice(@start(), @end())
    ).property('shuffled.length', 'page')

    shuffled: (->
      if content = @get('content') then $.shuffle(content) else []
    ).property('content.length')

    tick: ->
      @set('page', if @isLast() then 0 else @get('page') + 1)

    pages: (->
      length = @get('content.length')
      if length then parseInt(length / @get('perPage') + 1) else 1
    ).property('length')

    isLast: ->
      @get('page') == @get('pages') - 1

    start: ->
      @get('page') * @get('perPage')

    end: ->
      @start() + @get('perPage')

