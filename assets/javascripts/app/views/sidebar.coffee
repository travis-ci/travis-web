@Travis.reopen
  SidebarView: Travis.View.extend
    templateName: 'layouts/sidebar'

  WorkersListView: Travis.View.extend
    toggle: (event) ->
      $(event.target).closest('li').toggleClass('open')

  WorkersItemView: Travis.View.extend
    display: (->
      name = (@get('worker.name') || '').replace('travis-', '')
      state = @get('worker.state')
      payload = @get('worker.payload')

      if state == 'working' && payload != undefined
        repo = payload.repository.slug
        number = ' #' + payload.build.number
        "<span class='name'>#{name}: #{repo}</span> #{number}".htmlSafe()
      else
        "#{name}: #{state}"
    ).property('worker.state')


  QueueItemView: Travis.View.extend
    urlJob: (->
      Travis.Urls.job(@get('job.repository.slug'), @get('job.id'))
    ).property('job.repository.slug', 'job.id')

