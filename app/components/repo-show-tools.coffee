`import Ember from 'ember'`
`import config from 'travis/config/environment'`

RepoShowToolsComponent = Ember.Component.extend
  popup: Ember.inject.service()

  classNames: ['settings-menu']
  classNameBindings: ['isOpen:display']
  isOpen: false

  click: (event) ->
    if $(event.target).is('a') && $(event.target).parents('.settings-dropdown').length
      @closeMenu()

  closeMenu: ->
    @toggleProperty('isOpen')

  actions:
    menu: ->
      @toggleProperty('isOpen')

  hasPermission: (->
    if permissions = @get('currentUser.permissions')
      permissions.contains parseInt(@get('repo.id'))
  ).property('currentUser.permissions.length', 'repo.id')

  hasPushPermission: (->
    if permissions = @get('currentUser.pushPermissions')
      permissions.contains parseInt(@get('repo.id'))
  ).property('currentUser.pushPermissions.length', 'repo.id')

  hasAdminPermission: (->
    if permissions = @get('currentUser.adminPermissions')
      permissions.contains parseInt(@get('repo.id'))
  ).property('currentUser.adminPermissions.length', 'repo.id')

  displaySettingsLink: (->
    @get('hasPushPermission')
  ).property('hasPushPermission')

  displayCachesLink: (->
    @get('hasPushPermission') && config.endpoints.caches
  ).property('hasPushPermission')

  displayStatusImages: (->
    @get('hasPermission')
  ).property('hasPermission')

`export default RepoShowToolsComponent`
