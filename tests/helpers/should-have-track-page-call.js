import Ember from 'ember';

export default Ember.Test.registerHelper('shouldHaveTrackPageCall', function(app, assert, options) {
  const lastTrackedPage = app.__container__.lookup('service:metrics').get('trackedPages.lastObject');

  // TODO figure out how to include the current path in the test environment to assert against
  assert.equal(options.title, lastTrackedPage.title, 'expected last tracked page title to match');
});
