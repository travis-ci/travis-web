Travis.WorkersController = Em.ArrayController.extend
  groups: (->
    groups = {}
    for worker in @get('content').toArray()
      host = worker.get('host')
      groups[host] = Em.ArrayProxy.create(content: []) if !(host in groups)
      groups[host].pushObject(worker)
    $.values(groups)
  ).property('content.length')

