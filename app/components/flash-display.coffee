`import Ember from 'ember'`

FlashDisplayComponent = Ember.Component.extend
  flashes: Ember.inject.service()

  classNames: ['flash']
  tagName: 'ul'

  messagesBinding: 'flashes.messages'

  actions:
    closeMessage: (msg) ->
      @get('flashes').close(msg)

`export default FlashDisplayComponent`
