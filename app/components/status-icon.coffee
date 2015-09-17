`import Ember from 'ember'`

StatusIconComponent = Ember.Component.extend

  tagName: 'span'
  classNames: ['status-icon', 'icon']
  classNameBindings: ['status']

  hasPassed: (->
    @get('status') == 'passed'
  ).property('status')

  hasFailed: (->
    @get('status') == 'failed'
  ).property('status')

  hasErrored: (->
    @get('status') == 'errored'
  ).property('status')

  wasCanceled: (->
    @get('status') == 'canceled'
  ).property('status')

  isRunning: (->
    @get('status') == 'started' || 
    @get('status') == 'queued' ||
    @get('status') == 'booting' ||
    @get('status') == 'received' ||
    @get('status') == 'created'
  ).property('status')

  isEmpty: (->
    if @get('status') == null || @get('status') == ''
      true
    else
      false

  ).property('status')

`export default StatusIconComponent`
