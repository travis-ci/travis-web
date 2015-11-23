`import Ember from 'ember'`

Controller = Ember.Controller.extend

  actions:
    gaCta: (location) ->
      _gaq.push(['_trackPageview', '/virtual/signup?'+ location])
      @auth.signIn()

`export default Controller`
