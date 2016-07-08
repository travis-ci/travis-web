import Ember from 'ember';
import ConfigureInflectorInitializer from 'travis/initializers/configure-inflector';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | configure inflector', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  ConfigureInflectorInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
