`import Ember from 'ember'`

View = Ember.View.extend
  layoutName: (->
    if name = @get('controller.layoutName')
      'layouts/' + name
  ).property('controller.layoutName')

`export default View`
