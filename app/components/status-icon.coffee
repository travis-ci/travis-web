`import Ember from 'ember'`

StatusIconComponent = Ember.Component.extend

  tagName: 'span'
  classNames: ['status-icon']
  classNameBindings: ['build.state']

  hasPassed: (->
    @get('build.state') == 'passed'
  ).property('build.state')

  hasFailed: (->
    @get('build.state') == 'failed'
  ).property('build.state')

  hasErrored: (->
    @get('build.state') == 'errored'
  ).property('build.state')

  wasCanceled: (->
    @get('build.state') == 'canceled'
  ).property('build.state')

`export default StatusIconComponent`
