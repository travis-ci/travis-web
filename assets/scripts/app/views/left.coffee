@Travis.reopen
  ReposView: Travis.View.extend
    templateName: 'repos/list'
    tabBinding: 'controller.tab'

    classRecent: (->
      'active' if @get('tab') == 'recent'
    ).property('tab')

    classOwned: (->
      classes = []
      classes.push('active')  if @get('tab') == 'owned'
      classes.push('display') if @get('controller.currentUser')
      classes.join(' ')
    ).property('tab', 'controller.currentUser')

    classSearch: (->
      'active' if @get('tab') == 'search'
    ).property('tab')

