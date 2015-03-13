`import Ember from 'ember'`

Mixin = Ember.Mixin.create(
  restarting: false
  cancelling: false

  userHasPermissionForRepo: (->
    repo = @get('repo')
    user = @get('user')
    if user && repo
      user.hasAccessToRepo(repo)
  ).property('user.permissions.[]', 'repo', 'user')

  canCancel:  (->
    @get('item.canCancel') && @get('userHasPermissionForRepo')
  ).property('userHasPermissionForRepo', 'item.canCancel')

  canRestart:  (->
    @get('item.canRestart') && @get('userHasPermissionForRepo')
  ).property('userHasPermissionForRepo', 'item.canRestart')

  actions:
    restart: ->
      return if @get('restarting')
      @set('restarting', true)

      onFinished = =>
        @set('restarting', false)
      @get('item').restart().then(onFinished, onFinished)

    cancel: ->
      return if @get('cancelling')
      @set('cancelling', true)

      type = @get('type')

      @get('item').cancel().then =>
        @set('cancelling', false)
        Travis.flash(success: "#{type.capitalize()} has been successfully canceled.")
      , (xhr) =>
        @set('cancelling', false)
        if xhr.status == 422
          Travis.flash(error: "This #{type} can't be canceled")
        else if xhr.status == 403
          Travis.flash(error: "You don't have sufficient access to cancel this #{type}")
        else
          Travis.flash(error: "An error occured when canceling the #{type}")
)

`export default Mixin`
