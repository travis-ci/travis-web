`import Ember from 'ember'`
`import { githubCommit as githubCommitUrl } from 'travis/utils/urls'`
`import TravisRoute from 'travis/routes/basic'`
`import config from 'travis/config/environment'`

LandingRowComponent = Ember.Component.extend

  tagName: 'li'
  classNameBindings: ['repo.lastBuildState']
  classNames: ['landing-row', 'row-li']

`export default LandingRowComponent`
