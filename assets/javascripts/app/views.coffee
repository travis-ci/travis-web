require 'ext/ember/namespace'

@Travis.Views = Em.Namespace.create
  DefaultLayout: Em.View.extend(templateName: 'layouts/default')
  ProfileLayout: Em.View.extend(templateName: 'layouts/profile')

  TopView: Em.View.extend
    templateName: 'layouts/top'
    currentUser: (->
      Travis.app.currentUser
    ).property('Travis.app.currentUser')

  SidebarView:   Em.View.extend(templateName: 'layouts/sidebar')
  ProfileView:   Em.View.extend(templateName: 'profile/show')
  HooksView:     Em.View.extend(templateName: 'hooks/list')

require 'views/build'
require 'views/job'
require 'views/repo'
require 'views/tabs'

