@Travis.reopen
  ReposListTabsView: Travis.View.extend
    templateName: 'repos/list/tabs'
    tabBinding: 'controller.tab'

    activate: (event) ->
      @get('controller').activate(event.target.name)

    classRecent: (->
      'active' if @get('tab') == 'recent'
    ).property('tab')

    classOwned: (->
      classes = []
      classes.push('active')  if @get('tab') == 'owned'
      classes.push('display') if Em.get('Travis.currentUser')
      classes.join(' ')
    ).property('tab', 'Travis.currentUser')

    classSearch: (->
      'active' if @get('tab') == 'search'
    ).property('tab')


