`import Ember from 'ember'`
`import Ajax from 'travis/utils/ajax'`

Controller = Ember.Controller.extend
  isLoading: false

  githubProfile: (->
    "https://github.com/#{@get('model.login')}"
  ).property()

  avatarURL: (->
    if @get('model.avatar_url')
      "#{@get('model.avatar_url')}?s=125"
    else
      'https://secure.gravatar.com/avatar/?d=mm&s=125'
  ).property()

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

  repos: (->
    data = @get('model')

    repos = data.repositories.filter (item, index) -> 
      if item.default_branch.last_build
        item
    repos.sortBy('default_branch.last_build.finished_at').reverse()

  ).property('model')

  running: (->
    data = @get('model')

    repos = data.repositories.filter (item, index) -> 
      if item.default_branch.last_build != null 
        if item.default_branch.last_build.state == 'started'
          item
    repos

  ).property('model')

`export default Controller`
