`import Ember from 'ember'`
`import config from 'travis/config/environment'`

Location = Ember.HistoryLocation.extend
  init: ->
    @_super.apply this, arguments

    if auth = @get('auth')
      # location's getURL is first called before we even
      # get to routes, so autoSignIn won't be called in
      # such case
      auth.autoSignIn() unless auth.get('signedIn')

  getURL: ->
    url = this._super.apply(this, arguments)
    unless config.pro
      if location.pathname == '/'
        if @get('auth.signedIn')
          return '/repositories'
        else
          return '/home'

    url

  formatURL: (logicalPath) ->
    if logicalPath == '/repositories' || logicalPath == '/home'
      '/'
    else
      @_super.apply this, arguments

`export default Location`
