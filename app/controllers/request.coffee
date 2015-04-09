`import Ember from 'ember'`

Controller = Ember.ObjectController.extend
  requestClass: (->
    if @get('content.isAccepted')
      'accepted'
    else
      'rejected'
  ).property('content.isAccepted')

  type: (->
    if @get('isPullRequest')
      'pull_request'
    else
      'push'
  ).property('isPullRequest')

  status: (->
    if @get('isAccepted')
      'Accepted'
    else
      'Rejected'
  ).property('isAccepted')

  message: (->
    message = @get('model.message')
    if @config.pro && message == "private repository"
      ''
    else
      message
  ).property('model.message')

`export default Controller`
