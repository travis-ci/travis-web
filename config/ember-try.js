module.exports = {
  scenarios: [
    {
      name: 'default',
      dependencies: {}
    },
    {
      name: "release",
      dependencies: {
        "ember": "release"
      }
    },
    {
      name: "beta",
      dependencies: {
        "ember": "beta"
      }
    },
    {
      name: "canary",
      dependencies: {
        "ember": "canary"
      }
    },
    {
      name: 'data-beta',
      dependencies: {
        'ember-data': 'beta'
      }
    },
    {
      name: 'data-canary',
      dependencies: {
        'ember-data': 'canary'
      }
    }
  ],
  bowerOptions: ['--quiet'],
}
