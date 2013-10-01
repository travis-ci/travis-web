require 'ext/ember/namespace'

Em.View.reopen
  init: ->
    this.container ||= Travis.__container__

    @_super.apply(this, arguments)

@Travis.reopen
  View: Em.View.extend
    popup: (name) ->
      @popupCloseAll()
      name = event?.target?.name || name
      $("##{name}").toggleClass('display')
    popupClose: ->
      $(event.target).closest('.popup').removeClass('display')
    popupCloseAll: ->
      if view = Travis.View.currentPopupView
        view.destroy()
        Travis.View.currentPopupView = null

      $('.popup').removeClass('display')

Travis.GettingStartedView = Travis.View.extend
  templateName: 'no_owned_repos'

Travis.FirstSyncView = Travis.View.extend
  didInsertElement: ->
    this.addObserver('controller.isSyncing', this, this.isSyncingDidChange)

  willDestroyElement: ->
    this.removeObserver('controller.isSyncing', this, this.isSyncingDidChange)

  isSyncingDidChange: ->
    if !@get('controller.isSyncing')
      self = this
      Ember.run.later this, ->
        Travis.Repo.fetch(member: @get('controller.user.login')).then( (repos) ->
          if repos.get('length')
            self.get('controller').transitionToRoute('index.current')
          else
            self.get('controller').transitionToRoute('profile')
        ).then(null, (e) ->
          console.log('There was a problem while redirecting from first sync', e)
        )
      , Travis.config.syncingPageRedirectionTime


require 'views/accounts'
require 'views/application'
require 'views/build'
require 'views/events'
require 'views/flash'
require 'views/job'
require 'views/log'
require 'views/repo'
require 'views/profile'
require 'views/stats'
require 'views/signin'
require 'views/top'
require 'views/status_images'
