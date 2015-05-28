`import Ember from 'ember'`

LoadingIndicatorComponent = Ember.Component.extend
  tagName: 'div'
  classNameBindings: ['center:loading-container']
  center: false

`export default LoadingIndicatorComponent`
