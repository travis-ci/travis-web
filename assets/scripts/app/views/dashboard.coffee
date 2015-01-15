require 'views/view'

TravisView = Travis.View

View = TravisView.extend
  layoutName: 'layouts/dashboard'

Travis.DashboardView = View
