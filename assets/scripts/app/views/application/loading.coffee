require 'views/view'

TravisView = Travis.View

View = TravisView.extend
  layoutName: 'layouts/dashboard'
  classNames: ['dashboard']

Travis.LoadingView = View
