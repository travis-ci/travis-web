`import Ember from 'ember'`

RequestIconComponent = Ember.Component.extend

  tagName: 'span'
  classNames: ['status-icon', 'icon']
  classNameBindings: ['event', 'state']

  isPush: (->
    @get('event') == 'push'
  ).property('event')

  isPR: (->
    @get('event') == 'pull_request'
  ).property('event')

  isAPI: (->
    @get('event') == 'api'
  ).property('event')

  isEmpty: (->
    true if @get('event') == null || @get('event') == null
  ).property('event')

`export default RequestIconComponent`
