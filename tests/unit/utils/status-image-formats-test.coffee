`import Ember from 'ember'`
`import format from 'travis/utils/status-image-formats'`
`import config from 'travis/config/environment'`

module 'Status image formats'

test 'it generates CCTray url with a slug', ->
  url = format('CCTray', 'travis-ci/travis-web')
  equal url, '#/repos/travis-ci/travis-web/cc.xml'

test 'it generates CCTray url with a slug and a branch', ->
  url = format('CCTray', 'travis-ci/travis-web', 'development')
  equal url, '#/repos/travis-ci/travis-web/cc.xml?branch=development'
