require 'layout/base'

Travis.Layout.Left = Travis.Layout.Base.extend
  name: 'sidebar'

  init: ->
    @_super('repositories')
    @parent = @get('parent')
    @connectLeft(Travis.Repository.find())

  connect: ->
    @parent.connectOutlet(outletName: 'right', name: 'sidebar')

  connectLeft: (repositories) ->
    @parent.set('repositories', repositories)
    @parent.connectOutlet(outletName: 'left', name: 'repositories', context: repositories)
