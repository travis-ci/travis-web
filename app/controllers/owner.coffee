`import Ember from 'ember'`
`import Ajax from 'travis/utils/ajax'`

Controller = Ember.Controller.extend
  isLoading: false

  githubProfile: (->
    "https://github.com/#{@get('model.login')}"
  ).property()

  avatarURL: (->
    if @get('model.avatar_url')
      "#{@get('model.avatar_url')}?s=128"
    else
      'https://secure.gravatar.com/avatar/?d=mm&s=128'
  ).property()

  owner: (->
    data = @get('model')
    console.log(data)

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
      if item.active && item.default_branch.last_build != null
        item
    repos

  ).property('model')

  running: (->
    data = @get('model')

    repos = data.repositories.filter (item, index) -> 
      if item.active 
        if item.default_branch.last_build != null 
          if item.default_branch.last_build.state == 'started'
            item
    repos

  ).property('model')

`export default Controller`
