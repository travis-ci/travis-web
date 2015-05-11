`import Ember from 'ember'`
`import Ajax from 'travis/utils/ajax'`

Controller = Ember.Controller.extend
  isLoading: false

  test: ->
    console.log('CONTROLLER')


`export default Controller`
