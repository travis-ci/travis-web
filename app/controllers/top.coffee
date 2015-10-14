`import Ember from 'ember'`
`import Ajax from 'travis/utils/ajax'`
`import config from 'travis/config/environment'`

Controller = Ember.Controller.extend
  needs: ['currentUser']
  userBinding: 'controllers.currentUser.model'

  store: Ember.inject.service()
  currentUserBinding: 'auth.currentUser'

  userName: (->
    @get('user.name') || @get('user.login')
  ).property('user.login', 'user.name')

  gravatarUrl: (->
    "#{location.protocol}//www.gravatar.com/avatar/#{@get('user.gravatarId')}?s=48&d=mm"
  ).property('user.gravatarId')

  unseenBroadcasts: (->
    @get('broadcasts').filter (broadcast) ->
      !broadcast.get('isSeen')
  ).property('broadcasts.[]', 'broadcasts.length')

  v2broadcasts: (->
    broadcasts = Ember.ArrayProxy.create(content: [])

    if @get('currentUser.id')
      @get('store').find('broadcast').then (result) ->
        broadcasts.pushObjects(result.toArray())

      console.log(broadcasts)

    broadcasts
  ).property('currentUser.id')

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
        array = response.broadcasts.filter((broadcast) ->
            broadcast unless broadcast.expired
          ).map( (broadcast) ->
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
