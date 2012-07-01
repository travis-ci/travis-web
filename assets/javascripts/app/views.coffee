require 'ext/ember/namespace'

@Travis.Views = Em.Namespace.create
  HomeLayout:    Em.View.extend(templateName: 'layouts/home')
  ProfileLayout: Em.View.extend(templateName: 'layouts/simple')
  StatsLayout:   Em.View.extend(templateName: 'layouts/simple')

  SidebarView:   Em.View.extend(templateName: 'layouts/sidebar')
  StatsView:     Em.View.extend(templateName: 'stats/show')
  HooksView:     Em.View.extend(templateName: 'hooks/list')

require 'views/build'
require 'views/job'
require 'views/repo'
require 'views/profile'
require 'views/tabs'
require 'views/top'

