Travis.Layout = Em.Namespace.create()
Travis.Layout.instance = (name, parent) ->
  if @layout && @layout.name == name
    @layout
  else
    @layout = Travis.Layout[$.camelize(name)].create(parent: parent)

require 'layout/home'
require 'layout/sidebar'
require 'layout/profile'
require 'layout/stats'

