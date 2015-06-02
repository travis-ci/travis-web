`import Ember from 'ember'`

View = Ember.View.extend
  templateName: 'repos/list/tabs'
  tabBinding: 'controller.tab'
  currentUserBinding: 'controller.currentUser.model'

  classRecent: (->
    if @get('tab') == 'recent'
      'active'
    else if @get('tab') == 'search' && @get('controller').auth.get('signedIn')
      'hidden'
  ).property('tab')

  classRunning: (->
    classes = []
    classes.push('active')  if @get('tab') == 'running'
    classes.join(' ')
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

`export default View`
