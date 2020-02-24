import Service, { inject as service } from '@ember/service';
// import config from 'travis/config/environment';

export default Service.extend({
  ajax: service(),

  configs(repo, ref, mode, config) {
    let data = {
      repo: {
        slug: repo.get('slug'),
        private: repo.get('private'),
        default_branch: repo.get('defaultBranch.name')
      },
      ref: ref,
      mode: mode,
      config: config,
      type: 'api'
    };
    return this.request('/configs', 'POST', { data: data });
  },

  parse(configs) {
    return this.request('/parse', 'POST', {
      data: this.normalize(configs),
      contentType: 'application/vnd.travis-ci.configs+json'
    });
  },

  expand(config) {
    return this.request('/expand', 'POST', {
      data: { config: config }
    });
  },

  request(url, method = 'GET', options = {}) {
    // options.host = config.ymlEndpoint || 'https://yml-staging.travis-ci.org'; // TODO
    options.host = 'https://yml-staging.travis-ci.org';
    // options.host = 'http://localhost:9292';
    options.headers = this.headers(options);
    return this.ajax.request(url, method, options);
  },

  headers(options = {}) {
    const { headers = {} } = options;
    headers['Authorization'] = 'Basic eDpqZm5DcWJKbGJ2eFpsWDQwdUUwREtn'; // TODO
    return headers;
  },

  normalize(configs) {
    return configs.map(config => {
      if (config.source == 'api') {
        config.config = config.config.replace(/\t/gm, '  ');
      }
      return config;
    });
  },
});
