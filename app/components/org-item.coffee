`import Ember from 'ember'`

OrgItemComponent = Ember.Component.extend

  classNames: ['media', 'account']
  tagName: 'li'
  classNameBindings: ['type', 'selected']
  typeBinding: 'account.type'
  selectedBinding: 'account.selected'
  tokenIsVisible: false

  name: (->
    @get('account.name') || @get('account.login')
  ).property('account')

  avatarUrl: (->
    @get('account.avatarUrl') || false
  ).property('account')

  isUser: (->
    @get('account.type') == 'user'
  ).property('account')

  actions:
    tokenVisibility: () ->
      @toggleProperty('tokenIsVisible')

`export default OrgItemComponent`
