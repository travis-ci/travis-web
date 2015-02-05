require 'views/view'

TravisView = Travis.View

View = TravisView.extend
  layoutName: 'layouts/error'
  classNames: ['error']

Travis.Error404View = View
