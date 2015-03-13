`import Ember from 'ember'`

Component = Ember.Component.extend(
  actions:
    close: ->
      $('.popup').removeClass('display')
      return false

    removeLog: ->
      $('.popup').removeClass('display')
      job = @get('job')
      job.removeLog().then ->
        Travis.flash(success: 'Log has been successfully removed.')
      , (xhr) ->
        if xhr.status == 409
          Travis.flash(error: 'Log can\'t be removed')
        else if xhr.status == 401
          Travis.flash(error: 'You don\'t have sufficient access to remove the log')
        else
          Travis.flash(error: 'An error occured when removing the log')
)

`export default Component`
