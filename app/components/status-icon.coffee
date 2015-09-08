`import Ember from 'ember'`

StatusIconComponent = Ember.Component.extend

  tagName: 'span'
  classNames: ['status-icon']
  classNameBindings: ['build.last_build.state']

  hasPassed: (->
    @get('build.last_build.state') == 'passed'
  ).property('build.last_build.state')

  hasFailed: (->
    @get('build.last_build.state') == 'failed'
  ).property('build.last_build.state')

  hasErrored: (->
    @get('build.last_build.state') == 'errored'
  ).property('build.last_build.state')

  wasCanceled: (->
    @get('build.last_build.state') == 'canceled'
  ).property('build.last_build.state')

  isRunning: (->
    @get('build.last_build.state') == 'started' || 
    @get('build.last_build.state') == 'queued' ||
    @get('build.last_build.state') == 'booting' ||
    @get('build.last_build.state') == 'received' ||
    @get('build.last_build.state') == 'created'
  ).property('build.last_build.state')

  isEmpty: (->
    true if @get('build.last_build') == null
  ).property('build.last_build')

`export default StatusIconComponent`
