import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'travis/tests/helpers/start-app';
import proLandingPage from 'travis/tests/pages/landing-pro';

const mockConfig = Ember.Service.extend({
  pro: true,
  enterprise: false
});

module('Acceptance | home/landing pro test', {
  beforeEach() {
    const application = startApp();
    application.register('service:config', mockConfig);
  },

  afterEach() {
    Ember.run(application, 'destroy');
  }
});

QUnit.only('view landing page when unauthenticated', function(assert) {
  proLandingPage
    .visit();

  andThen(function() {
    assert.equal(currentPath(), 'home-pro');
    assert.equal(proLandingPage.heroText, 'Foobar');
  });
});
