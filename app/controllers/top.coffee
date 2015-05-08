`import Ember from 'ember'`

Controller = Ember.Controller.extend
  needs: ['currentUser']
  userBinding: 'controllers.currentUser.model'

  userName: (->
    @get('user.name') || @get('user.login')
  ).property('user.login', 'user.name')

  gravatarUrl: (->
    "#{location.protocol}//www.gravatar.com/avatar/#{@get('user.gravatarId')}?s=48&d=mm"
  ).property('user.gravatarId')

  actions: {
    toggleBurgerMenu: ->
      @toggleProperty('is-open')
      return false
  }

  showCta: (->
    !@get('auth.signedIn') && !@get('config.pro') && !@get('landingPage')
  ).property('auth.signedIn', 'landingPage')

`export default Controller`
