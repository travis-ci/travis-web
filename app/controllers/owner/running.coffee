`import Ember from 'ember'`

Controller = Ember.Controller.extend
  isLoading: false

  running: (->
    data = @get('model')

    repos = data.repositories.filter (item, index) -> 
      if item.default_branch.last_build != null 
        if item.default_branch.last_build.state == 'started'
          item
    repos

  ).property('model')

`export default Controller`
