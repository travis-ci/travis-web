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
    @get('model')
  ).property('model')

`export default Controller`
