require 'ext/ember/namespace'

@Travis.Views = Em.Namespace.create
  SidebarView: Em.View.extend(templateName: 'layouts/sidebar')
  QueuesView: Em.View.extend(templateName: 'queues/list')
  WorkersView: Em.View.extend(templateName: 'workers/list')

require 'views/build'
require 'views/job'
require 'views/repo'
require 'views/tabs'

