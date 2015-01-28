safe = Travis.Helpers.safe
formatCommitHelper = Travis.Helpers.formatCommit

formatCommit = (commit) ->
  safe formatCommitHelper(commit.get('sha'), commit.get('branch')) if commit

Travis.Handlebars.formatCommit = formatCommit
