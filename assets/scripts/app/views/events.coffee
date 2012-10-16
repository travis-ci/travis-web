@Travis.reopen
  EventsView: Travis.View.extend
    templateName: 'events/list'
    eventsBinding: 'controller.events'

  EventsItemView: Travis.View.extend
    tagName: 'tr'

