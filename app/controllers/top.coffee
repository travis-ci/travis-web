`import Ember from 'ember'`
`import Ajax from 'travis/utils/ajax'`
`import config from 'travis/config/environment'`

Controller = Ember.Controller.extend
  needs: ['currentUser']
  userBinding: 'controllers.currentUser.model'

  userName: (->
    @get('user.name') || @get('user.login')
  ).property('user.login', 'user.name')

  gravatarUrl: (->
    "#{location.protocol}//www.gravatar.com/avatar/#{@get('user.gravatarId')}?s=48&d=mm"
  ).property('user.gravatarId')

  broadcasts: (->

    if @get('auth.signedIn')
      broadcasts = Ember.ArrayProxy.create(
        content: [],
        lastBroadcastStatus: '',
        isLoading: true
      )
      apiEndpoint = config.apiEndpoint
      options = {}
      options.type = 'GET'
      options.headers = { Authorization: "token #{@auth.token()}" }

      $.ajax("#{apiEndpoint}/v3/broadcasts", options).then (response) ->
        array = response.broadcasts.map( (broadcast) ->
          Ember.Object.create(broadcast)
        ).reverse()
        
        broadcasts.set('lastBroadcastStatus', array[0].category)
        broadcasts.set('content', array)
        broadcasts.set('isLoading', false)

      broadcasts
  ).property('broadcasts')

  actions: {
    toggleBurgerMenu: ->
      @toggleProperty('is-open')
      return false

    toggleBroadcasts: ->
      @toggleProperty('showBroadcasts')
      return false
  }

  showCta: (->
    !@get('auth.signedIn') && !@get('config.pro') && !@get('landingPage')
  ).property('auth.signedIn', 'landingPage')

`export default Controller`
