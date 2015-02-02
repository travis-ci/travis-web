require 'views/basic'

TravisView = Travis.BasicView

View = TravisView.extend
  layoutName: 'layouts/dashboard'
  classNames: ['dashboard']

Travis.DashboardView = View
