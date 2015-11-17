# `import Ember from 'ember'`
# `import { account as accountUrl } from 'travis/utils/urls'`

# View = Ember.CollectionView.extend
#   elementId: 'accounts'
#   accountBinding: 'content'
#   tagName: 'ul'

#   emptyView: Ember.View.extend
#     templateName: 'accounts-list/empty'

#   itemViewClass: Ember.View.extend
#     accountBinding: 'content'
#     typeBinding: 'content.type'
#     selectedBinding: 'account.selected'

#     classNames: ['account']
#     classNameBindings: ['type', 'selected']

#     name: (->
#       @get('content.name') || @get('content.login')
#     ).property('content.login', 'content.name')

#     urlAccount: (->
#       accountUrl(@get('account.login'))
#     ).property('account.login')

#     avatarUrl: (->
#       @get('account.avatarUrl') || "//placehold.it/50x50"
#     ).property('account.avatarUrl')

#     click: ->
#       @get('controller').transitionToRoute("account", @get('account.login'))

# `export default View`
