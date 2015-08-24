`import Ember from 'ember'`
`import config from 'travis/config/environment'`

TravisStatusComponent = Ember.Component.extend
  status: null

  statusPageStatusUrl: (->
    config.statusPageStatusUrl
  ).property()

  didInsertElement: ->
    if url = @get('statusPageStatusUrl')
      self = this
      @getStatus(url).then (response) ->
        if response.status and response.status.indicator
          self.set('status', response.status.indicator)

  getStatus: (url) ->
    $.ajax(url)

`export default TravisStatusComponent`
