`import Ember from 'ember'`

LoadingIndicatorComponent = Ember.Component.extend
  tagName: 'div'
  classNameBindings: ['center:loading-container', 'inline:inline-block', 'height:icon-height']
  center: false

`export default LoadingIndicatorComponent`
