`import Ember from 'ember'`

Controller = Ember.Controller.extend
  isLoading: false

  githubProfile: (->
    "https://github.com/#{@get('model.login')}"
  ).property('model')

  avatarURL: (->
    if @get('model.avatar_url')
      "#{@get('model.avatar_url')}?s=125"
    else
      'https://secure.gravatar.com/avatar/?d=mm&s=125'
  ).property('model')

  owner: (->
    data = @get('model')

    {
      login: data.login
      name: data.name
      isSyncing: data.is_syncing
      avatarUrl: data.avatar_url
      syncedAt: data.synced_at
    }

  ).property('model')

`export default Controller`
