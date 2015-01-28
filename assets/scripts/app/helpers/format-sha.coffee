formatShaHelper = Travis.Helpers.formatSha
safe = Travis.Helpers.safe

formatSha = (sha) ->
  safe formatShaHelper(sha)

Travis.Handlebars.formatSha = formatSha
