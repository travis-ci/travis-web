`import Ember from 'ember'`

RequestIconComponent = Ember.Component.extend

  tagName: 'span'
  classNames: ['icon-request', 'icon']
  classNameBindings: ['build.last_build.state', 'build.state']

  isPush: (->
    @get('build.last_build.event_type') == 'push' ||
    @get('build.event_type') == 'push'
  ).property('build.last_build')

  isPR: (->
    @get('build.last_build.event_type') == 'pull_request' ||
    @get('build.event_type') == 'pull_request'
  ).property('build.last_build')

  isAPI: (->
    @get('build.last_build.event_type') == 'api' ||
    @get('build.event_type') == 'api'
  ).property('build.last_build')

  isEmpty: (->
    true if @get('build.last_build') == null || @get('build') == null
  ).property('build.last_build')



`export default RequestIconComponent`
