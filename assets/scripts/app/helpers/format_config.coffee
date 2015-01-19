formatConfigHelper = Travis.Helpers.formatConfig
safe = Travis.Helpers.safe

formatConfig = (config, options) ->
  safe formatConfigHelper(config)

Travis.Handlebars.formatConfig = formatConfig

