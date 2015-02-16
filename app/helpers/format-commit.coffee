`import { safe, formatCommit as formatCommitHelper } from 'travis/utils/helpers'`

helper = Ember.Handlebars.makeBoundHelper (commit) ->
  safe formatCommitHelper(commit.get('sha'), commit.get('branch')) if commit

`export default helper`
