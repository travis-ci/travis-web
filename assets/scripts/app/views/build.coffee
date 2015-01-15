Travis.reopen
  BuildView: Travis.View.extend
    classNameBindings: ['color', 'loading']
    buildBinding: 'controller.build'
    loadingBinding: 'controller.loading'

    color: (->
      Travis.Helpers.colorForState(@get('build.state'))
    ).property('build.state')
