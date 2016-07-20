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
        "ember": "backspace/ember#guard-emberView"
      },
      resolutions: {
        "ember": "guard-emberView"
      }
    }
  ]
}
