@Travis.reopen
  SidebarView: Travis.View.extend
    templateName: 'layouts/sidebar'

  WorkersView: Travis.View.extend
    toggle: (event) ->
      $(event.target).closest('li').toggleClass('open')

  QueueItemView: Travis.View.extend
    urlJob: (->
      Travis.Urls.job(@get('job.repository.slug'), @get('job.id'))
    ).property('job.repository.slug', 'job.id')

