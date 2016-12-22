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
      npm: {
        devDependencies: {
          'ember-data': 'emberjs/data#beta'
        }
      }
    },
    {
      name: 'data-canary',
      npm: {
        devDependencies: {
          'ember-data': 'emberjs/data#canary'
        }
      }
    }
  ],
  bowerOptions: ['--quiet'],
}
