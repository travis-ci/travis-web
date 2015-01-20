View = Travis.View.extend
  templateName: 'repos/show/tabs'

  tabBinding: 'controller.tab'
  contextBinding: 'controller'

  # hrm. how to parametrize bind-attr?
  classCurrent: (->
    'active' if @get('tab') == 'current'
  ).property('tab')

  classBuilds: (->
    'active' if @get('tab') == 'builds'
  ).property('tab')

  classPullRequests: (->
    'active' if @get('tab') == 'pull_requests'
  ).property('tab')

  classBranches: (->
    'active' if @get('tab') == 'branches'
  ).property('tab')

  classEvents: (->
    'active' if @get('tab') == 'events'
  ).property('tab')

  classBuild: (->
    tab = @get('tab')
    classes = []
    classes.push('active') if tab == 'build'
    classes.push('display-inline') if tab == 'build' || tab == 'job'
    classes.join(' ')
  ).property('tab')

  # TODO: refactor tabs, most of the things here are not really DRY
  classJob: (->
    'active display-inline' if @get('tab') == 'job'
  ).property('tab')

  classRequests: (->
    'active display-inline' if @get('tab') == 'requests'
  ).property('tab')

  classCaches: (->
    'active display-inline' if @get('tab') == 'caches'
  ).property('tab')

  classSettings: (->
    'active display-inline' if @get('tab') == 'settings'
  ).property('tab')

  classRequest: (->
    'active display-inline' if @get('tab') == 'request'
  ).property('tab')

Travis.RepoShowTabsView = View
