Travis.BuildController = Ember.Controller.extend
  needs: ['repo']
  repoBinding: 'controllers.repo.repo'
  buildBinding: 'controllers.repo.build'
  commitBinding: 'build.commit'

  currentItemBinding: 'build'

  loading: (->
    !@get('build.isLoaded')
  ).property('build.isLoaded')
