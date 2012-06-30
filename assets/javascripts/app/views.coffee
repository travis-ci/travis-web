require 'ext/ember/namespace'

@Travis.Views = Em.Namespace.create
  SidebarView:  Em.View.extend(templateName: 'layouts/sidebar')

require 'views/build'
require 'views/job'
require 'views/repo'
require 'views/tabs'

