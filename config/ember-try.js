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
      name: "😳",
      dependencies: {
        "ember": "beta"
      }
    },
    {
      name: "canary",
      dependencies: {
        "ember": "canary"
      }
    }
  ],
  bowerOptions: ['--quiet'],
}
