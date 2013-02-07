@Travis.reopen
  SidebarView: Travis.View.extend
    templateName: 'layouts/sidebar'

    DecksView: Em.View.extend
      templateName: "sponsors/decks"
      controller: Travis.SponsorsController.create
        perPage: 1

      didInsertElement: ->
        controller = @get 'controller'
        unless controller.get('content')
          Travis.app.get('router.sidebarController').tickables.push(controller)
          controller.set 'content', Travis.Sponsor.decks()
        @_super.apply this, arguments

    LinksView: Em.View.extend
      templateName: "sponsors/links"
      controller: Travis.SponsorsController.create
        perPage: 6

      didInsertElement: ->
        controller = @get 'controller'
        unless controller.get('content')
          controller.set 'content', Travis.Sponsor.links()
          Travis.app.get('router.sidebarController').tickables.push(controller)
        @_super.apply this, arguments

    WorkersView: Em.View.extend
      templateName: 'workers/list'
      controller: Travis.WorkersController.create()

      didInsertElement: ->
        @set 'controller.content', Travis.Worker.find()
        @_super.apply this, arguments

    QueuesView: Em.View.extend
      templateName: 'queues/list'
      controller: Em.ArrayController.create()

      showAll: (event) ->
        queue = event.context
        queue.showAll()

      didInsertElement: ->
        queues = for queue in Travis.QUEUES
          Travis.LimitedArray.create
            content: Travis.Job.queued(queue.name), limit: 20
            id: "queue_#{queue.name}"
            name: queue.display
        @set 'controller.content', queues
        @_super.apply this, arguments

    RunningJobsView: Em.View.extend
      templateName: 'jobs/running'
      elementId: 'running-jobs'
      controller: Travis.RunningJobsController.create()

      groupsBinding: 'controller.groups'

      didInsertElement: ->
        @get('controller').set 'content', Travis.Job.running()

      GroupView: Em.View.extend
        templateName: 'jobs/running/group'
        tagName: 'li'
        contextBinding: 'group'
        expanded: false
        classNameBindings: ['expanded']
        classNames: ['group']
        toggle: ->
          @toggleProperty('expanded')


  WorkersView: Travis.View.extend
    toggleWorkers: (event) ->
      handle = $(event.target).toggleClass('open')
      if handle.hasClass('open')
        $('#workers li').addClass('open')
      else
        $('#workers li').removeClass('open')

  WorkersListView: Travis.View.extend
    toggle: (event) ->
      $(event.target).closest('li').toggleClass('open')

  WorkersItemView: Travis.View.extend
    display: (->
      name = (@get('worker.name') || '').replace('travis-', '')
      state = @get('worker.state')

      if state == 'working'
        "<span class='name'>#{name}: #{@get('worker.repoSlug')}</span> ##{@get('worker.jobNumber')}".htmlSafe()
      else
        "#{name}: #{state}"
    ).property('worker.state')


  QueueItemView: Travis.View.extend
    tagName: 'li'
