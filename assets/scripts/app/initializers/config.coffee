loadConfig =  ->
  pages_endpoint   = $('meta[rel="travis.pages_endpoint"]').attr('href')
  billing_endpoint = $('meta[rel="travis.billing_endpoint"]').attr('href')
  customer_io_site_id = $('meta[name="travis.customer_io_site_id"]').attr('value')
  setupCustomerio(customer_io_site_id) if customer_io_site_id

  enterprise = $('meta[name="travis.enterprise"]').attr('value') == 'true'

  # for now I set pro to true also for enterprise, but it should be changed
  # to allow more granular config later
  pro = $('meta[name="travis.pro"]').attr('value') == 'true' || enterprise

  return {
    syncingPageRedirectionTime: 5000
    api_endpoint:    $('meta[rel="travis.api_endpoint"]').attr('href')
    source_endpoint: $('meta[rel="travis.source_endpoint"]').attr('href')
    pusher_key:      $('meta[name="travis.pusher_key"]').attr('value')
    pusher_host:     $('meta[name="travis.pusher_host"]').attr('value')
    ga_code:         $('meta[name="travis.ga_code"]').attr('value')
    code_climate: $('meta[name="travis.code_climate"]').attr('value')
    ssh_key_enabled: $('meta[name="travis.ssh_key_enabled"]').attr('value') == 'true'
    code_climate_url: $('meta[name="travis.code_climate_url"]').attr('value')
    caches_enabled: $('meta[name="travis.caches_enabled"]').attr('value') == 'true'
    show_repos_hint: 'private'
    avatar_default_url: 'https://travis-ci.org/images/ui/default-avatar.png'
    pusher_log_fallback:  $('meta[name="travis.pusher_log_fallback"]').attr('value') == 'true'
    pro: pro
    enterprise: enterprise
    sidebar_support_box: pro && !enterprise

    pages_endpoint: pages_endpoint || billing_endpoint
    billing_endpoint: billing_endpoint

    url_legal:   "#{billing_endpoint}/pages/legal"
    url_imprint: "#{billing_endpoint}/pages/imprint"
    url_security: "#{billing_endpoint}/pages/security"
    url_terms:   "#{billing_endpoint}/pages/terms"
    customer_io_site_id: customer_io_site_id

    intervals: { times: -1, updateTimes: 1000 }
  }

initialize = (container, application) ->
  application.register 'config:main', application.config, { instantiate: false }

  application.inject('controller', 'config', 'config:main')
  application.inject('route', 'config', 'config:main')
  application.inject('auth', 'config', 'config:main')

ConfigInitializer =
  name: 'config'
  initialize: initialize

Ember.onLoad 'Ember.Application', (Application) ->
  Application.config loadConfig()

  Application.ajax.pro = Application.config.pro

  Application.initializer ConfigInitializer
