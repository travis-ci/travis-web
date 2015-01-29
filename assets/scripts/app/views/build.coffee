colorForState = Travis.Helpers.colorForState

View = Travis.View.extend
    classNameBindings: ['color', 'loading']
    buildBinding: 'controller.build'
    loadingBinding: 'controller.loading'

    color: (->
      colorForState(@get('build.state'))
    ).property('build.state')

Travis.BuildView = View
