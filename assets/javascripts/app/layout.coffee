Travis.Layout = Em.Namespace.create()
Travis.Layout.instance = (name, parent) ->
    if @layout && @layout.name == name
      @layout
    else
      @layout = Travis.Layout[name].create(parent: parent)

require 'layout/default'
require 'layout/sidebar'
require 'layout/profile'

