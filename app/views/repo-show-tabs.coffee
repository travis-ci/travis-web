`import Ember from 'ember'`

View = Ember.View.extend
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

  classBuild: (->
    tab = @get('tab')
    classes = []
    classes.push('active') if tab == 'build'
    classes.push('display-inline') if tab == 'build' || tab == 'job'
    classes.join(' ')
  ).property('tab')

  # TODO: refactor tabs, most of the things here are not really DRY
  classJob: (->
    'active' if @get('tab') == 'job'
  ).property('tab')

  classRequests: (->
    'active' if @get('tab') == 'requests'
  ).property('tab')

  classCaches: (->
    'active' if @get('tab') == 'caches'
  ).property('tab')

  classSettings: (->
    'active' if @get('tab') == 'settings'
  ).property('tab')

  classRequest: (->
    'active' if @get('tab') == 'request'
  ).property('tab')

`export default View`
