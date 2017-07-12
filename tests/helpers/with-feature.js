import Ember from 'ember';

export function withFeature(app, featureName) {
  let container = app.container || app.__container__;
  let featuresService = container.lookup('service:features');
  Ember.run(() => {
    featuresService.enable(featureName);
  });
}

export function withoutFeature(app, featureName) {
  let container = app.container || app.__container__;
  let featuresService = container.lookup('service:features');
  featuresService.disable(featureName);
}

Ember.Test.registerHelper('withFeature', withFeature);
Ember.Test.registerHelper('withoutFeature', withoutFeature);
