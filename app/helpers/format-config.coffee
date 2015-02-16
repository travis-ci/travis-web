`import { safe, formatConfig as formatConfigHelper } from 'travis/utils/helpers'`

formatConfig = (config, options) ->
  safe formatConfigHelper(config)

`export default helper`
