`import Ember from 'ember'`

LoadingIndicatorComponent = Ember.Component.extend
  tagName: 'div'
  classNameBindings: ['center:loading-container', 'inline:inline-block']
  center: false

`export default LoadingIndicatorComponent`
