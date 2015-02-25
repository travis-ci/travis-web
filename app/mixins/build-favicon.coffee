`import Ember from 'ember'`
`import { colorForState } from 'travis/utils/helpers'`
`import FaviconManager from 'travis/utils/favicon-manager'`
`import getFaviconUri from 'travis/utils/favicon-data-uris'`

Mixin = Ember.Mixin.create
  actions:
    faviconStateDidChange: (state) ->
      if state
        @setFaviconForState(state)
      else
        @setDefault()

  init: ->
    @faviconManager = new FaviconManager()

    @_super.apply this, arguments

  setFaviconForState: (state) ->
    color = colorForState(state)

    @setFavicon(getFaviconUri(color))

  setDefault: ->
    @setFavicon(getFaviconUri('default'))

  setFavicon: (href) ->
    @faviconManager.setFavicon(href)

`export default Mixin`
