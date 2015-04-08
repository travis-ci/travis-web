`import Ember from 'ember'`

Route = Ember.Route.extend
  redirect: ->
    @transitionTo('main')

`export default Route`
