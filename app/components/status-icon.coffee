`import Ember from 'ember'`

StatusIconComponent = Ember.Component.extend

  tagName: 'span'
  classNames: ['status-icon']
  classNameBindings: ['build.last_build.state']

  hasPassed: (->
    @get('build.last_build.state') == 'passed' ||
    @get('build.state') == 'passed'
  ).property('build')

  hasFailed: (->
    @get('build.last_build.state') == 'failed' ||
    @get('build.state') == 'failed'
  ).property('build')

  hasErrored: (->
    @get('build.last_build.state') == 'errored' ||
    @get('build.state') == 'errored'
  ).property('build')

  wasCanceled: (->
    @get('build.last_build.state') == 'canceled' ||
    @get('build.state') == 'canceled'
  ).property('build')

  isRunning: (->
    @get('build.last_build.state') == 'started' || 
    @get('build.last_build.state') == 'queued' ||
    @get('build.last_build.state') == 'booting' ||
    @get('build.last_build.state') == 'received' ||
    @get('build.last_build.state') == 'created' ||
    @get('build.state') == 'started' || 
    @get('build.state') == 'queued' ||
    @get('build.state') == 'booting' ||
    @get('build.state') == 'received' ||
    @get('build.state') == 'created'
  ).property('build')

  isEmpty: (->
    if @get('build.@type') == 'branch'
      true if @get('build.last_build.state') == null
    else if @get('build.@type') == 'build'
      false if @get('build.state') != ''

  ).property('build')

`export default StatusIconComponent`
