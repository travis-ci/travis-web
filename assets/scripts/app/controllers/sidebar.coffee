Travis.reopen
  SidebarController: Em.ArrayController.extend
    init: ->
      @tickables = []
      Travis.Ticker.create(target: this, interval: Travis.INTERVALS.sponsors)

    tick: ->
      tickable.tick() for tickable in @tickables

  QueuesController: Em.ArrayController.extend()

  WorkersController: Em.ArrayController.extend
    groups: (->
      if content = @get 'arrangedContent'
        groups = {}
        for worker in content.toArray()
          host = worker.get('host')
          unless groups[host]
            groups[host] = Em.ArrayProxy.create(Em.SortableMixin,
              content: [],
              sortProperties: ['nameForSort']
            )
          groups[host].addObject(worker)

        $.values(groups)
    ).property('length')

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

