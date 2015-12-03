`import Ember from 'ember'`

StatusIconComponent = Ember.Component.extend

  tagName: 'span'
  classNames: ['status-icon', 'icon']
  classNameBindings: ['status']

  hasPassed: (->
    @get('status') == 'passed' || @get('status') == 'accepted'
  ).property('status')

  hasFailed: (->
    @get('status') == 'failed' || @get('status') == 'rejected'
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
    unless @get('status')
      true
    else
      if @get('status') == ''
        true
      else
        false

  ).property('status')

`export default StatusIconComponent`
