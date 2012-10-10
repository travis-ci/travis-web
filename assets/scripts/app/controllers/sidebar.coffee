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
          groups[host] = Em.ArrayProxy.create(content: []) unless groups[host]
          groups[host].pushObject(worker)

        prepareForSort = (str) ->
          match = str.match /(.*?)-(\d+)/
          name = match[1]
          id   = match[2].toString()
          if id.length < 2
            id = "00#{id}"
          else if id.length < 3
            id = "0#{id}"

          "#{name}-#{id}"

        for own host, workers of groups
          groups[host] = workers.toArray().sort (a, b) ->
            a = prepareForSort a.get('name')
            b = prepareForSort b.get('name')

            if a < b
              -1
            else if b < a
              1
            else
              0

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

