`import Ember from 'ember'`

RequestIconComponent = Ember.Component.extend

  tagName: 'span'
  classNames: ['icon-request']
  classNameBindings: ['build.state']

  isPush: (->
    @get('build.eventType') == 'push'
  ).property('build.eventType')

  isPR: (->
    @get('build.eventType') == 'pull_request'
  ).property('build.eventType')

  isAPI: (->
    @get('build.eventType') == 'api'
  ).property('build.eventType')



`export default RequestIconComponent`
