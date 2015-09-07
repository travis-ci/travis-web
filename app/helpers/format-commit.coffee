`import { safe, formatCommit as formatCommitHelper } from 'travis/utils/helpers'`

helper = Ember.HTMLBars.makeBoundHelper (params) ->
  commit = params[0]
  safe formatCommitHelper(commit.get('sha'), commit.get('branch')) if commit

`export default helper`
