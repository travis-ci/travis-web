var billing_endpoint, customer_io_site_id, enterprise, pages_endpoint, pro, pusher, pusher_host, pusher_key, pusher_log_fallback, pusher_path;

pages_endpoint = $('meta[rel="travis.pages_endpoint"]').attr('href');
billing_endpoint = $('meta[rel="travis.billing_endpoint"]').attr('href');
customer_io_site_id = $('meta[name="travis.customer_io_site_id"]').attr('value');

if (customer_io_site_id) {
  setupCustomerio(customer_io_site_id);
}

enterprise = $('meta[name="travis.enterprise"]').attr('value') === 'true';
pro = $('meta[name="travis.pro"]').attr('value') === 'true' || enterprise;
pusher_key = $('meta[name="travis.pusher_key"]').attr('value');
pusher_host = $('meta[name="travis.pusher_host"]').attr('value');
pusher_path = $('meta[name="travis.pusher_path"]').attr('value');
pusher_log_fallback = $('meta[name="travis.pusher_log_fallback"]').attr('value') === 'true';

if (pro) {
  pusher = {
    channels: [],
    channel_prefix: 'private-',
    encrypted: true
  };
} else {
  pusher = {
    channels: ['common'],
    channel_prefix: '',
    encrypted: false
  };
}

pusher.key = pusher_key;
pusher.host = pusher_host;
pusher.path = pusher_path;
pusher.log_fallback = pusher_log_fallback;

config = {
  syncingPageRedirectionTime: 5000,
  api_endpoint: $('meta[rel="travis.api_endpoint"]').attr('href'),
  source_endpoint: $('meta[rel="travis.source_endpoint"]').attr('href'),
  ga_code: $('meta[name="travis.ga_code"]').attr('value'),
  code_climate: $('meta[name="travis.code_climate"]').attr('value'),
  endpoints: {
    ssh_key: $('meta[name="travis.ssh_key_enabled"]').attr('value') === 'true',
    caches: $('meta[name="travis.caches_enabled"]').attr('value') === 'true'
  },
  code_climate_url: $('meta[name="travis.code_climate_url"]').attr('value'),
  show_repos_hint: 'private',
  avatar_default_url: 'https://travis-ci.org/images/ui/default-avatar.png',
  pro: pro,
  enterprise: enterprise,
  sidebar_support_box: pro && !enterprise,
  pages_endpoint: pages_endpoint || billing_endpoint,
  billing_endpoint: billing_endpoint,
  url_legal: billing_endpoint + "/pages/legal",
  url_imprint: billing_endpoint + "/pages/imprint",
  url_security: billing_endpoint + "/pages/security",
  url_terms: billing_endpoint + "/pages/terms",
  customer_io_site_id: customer_io_site_id,
  intervals: {
    times: -1,
    updateTimes: 1000
  },
  pusher: pusher
};

if(!window.ENV) {
  window.ENV = {};
}
window.ENV.config = config;
