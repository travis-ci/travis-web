`import Ember from 'ember'`
`import config from 'travis/config/environment'`

RequestsItemComponent = Ember.Component.extend
  classNames: ['request-item']
  classNameBindings: ['requestClass']
  tagName: 'li'

  requestClass: (->
    if @get('request.isAccepted')
      'accepted'
    else
      'rejected'
  ).property('content.isAccepted')

  type: (->
    if @get('request.isPullRequest')
      'pull_request'
    else
      'push'
  ).property('request.isPullRequest')

  status: (->
    if @get('request.isAccepted')
      'Accepted'
    else
      'Rejected'
  ).property('request.isAccepted')

  hasBranchName: (->
    @get('request.branchName')
  ).property('request')

  message: (->
    message = @get('request.message')

    if message == 'github pages branch'
       @set('isGHPages', true)

    if config.pro && message == "private repository"
      ''
    else if !message
      'Build created successfully '
    else
      message
  ).property('request.message')


`export default RequestsItemComponent`
