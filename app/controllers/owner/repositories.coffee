`import Ember from 'ember'`
`import Ajax from 'travis/utils/ajax'`

Controller = Ember.Controller.extend
  isLoading: false

  repos: (->
    data = @get('model')

    repos = data.repositories.filter (item, index) -> 
      if item.active
        console.log(item)
        item
    repos.sortBy('default_branch.last_build.finished_at').reverse()

  ).property('model')

  # running: (->
  #   data = @get('model')

  #   repos = data.repositories.filter (item, index) -> 
  #     if item.default_branch.last_build != null 
  #       if item.default_branch.last_build.state == 'started'
  #         item
  #   repos

  # ).property('model')

`export default Controller`
