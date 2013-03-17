Travis.CurrentUserController = Em.ObjectController.extend
  sync: ->
    @get('content').sync()
