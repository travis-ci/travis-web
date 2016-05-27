import Ember from 'ember';

export default Ember.Test.registerHelper('shouldHaveIdentifyCall', function(app, assert, options) {
  assert.deepEqual(app.__container__.lookup('service:metrics').get('identifications.firstObject'), options, 'expected a matching identify event');
});
