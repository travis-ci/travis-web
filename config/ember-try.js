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
        "ember": "rwjblue/ember#pr-14110"
      },
      resolutions: {
        'ember': 'pr-14110'
      }
    },
    {
      name: "canary",
      dependencies: {
        "ember": "canary"
      }
    }
  ]
}
