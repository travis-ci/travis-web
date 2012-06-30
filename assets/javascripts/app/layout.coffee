Travis.Layout = Em.Namespace.create()
Travis.Layout.instance = (name) ->
    if @layout && @layout.name == name
      @layout
    else
      @layout = Travis.Layout[name].create(name: name)

require 'layout/default'
require 'layout/sidebar'
require 'layout/profile'

