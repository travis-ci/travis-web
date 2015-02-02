View = Travis.BasicView.extend
  templateName: 'repos/list/tabs'
  tabBinding: 'controller.tab'
  currentUserBinding: 'controller.currentUser.id'

  classRecent: (->
    'active' if @get('tab') == 'recent'
  ).property('tab')

  classOwned: (->
    classes = []
    classes.push('active')  if @get('tab') == 'owned'
    classes.push('display-inline') if @get('currentUser')
    classes.join(' ')
  ).property('tab', 'currentUser')

  classSearch: (->
    'active' if @get('tab') == 'search'
  ).property('tab')

  classNew: (->
    'display-inline' if @get('currentUser')
  ).property('currentUser')

Travis.ReposListTabsView = View
