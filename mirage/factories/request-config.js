import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  raw_configs() {
    return [{
      source: 'test/test_repo:.travis.yml@master',
      config: 'script: echo "Hello World"',
      mode: 'deep_merge_append'
    }];
  },

  request_config() {
    return {
      config: {
        language: 'node_js',
        os: ['linux'],
      }
    };
  },

  job_configs() {
    return [{
      config: {
        os: 'linux',
        language: 'node_js',
      }
    }];
  },

  messages() {
    return [
      {
        type: 'config',
        level: 'info',
        key: 'root',
        code: 'default',
        args: {
          key: 'os',
          default: 'linux'
        }
      }
    ];
  },
});
