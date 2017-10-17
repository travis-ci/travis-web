import { registerHelper } from '@ember/test';
import { run } from '@ember/runloop';

export function withFeature(app, featureName) {
  let container = app.container || app.__container__;
  let featuresService = container.lookup('service:features');
  run(() => {
    featuresService.enable(featureName);
  });
}

export function withoutFeature(app, featureName) {
  let container = app.container || app.__container__;
  let featuresService = container.lookup('service:features');
  featuresService.disable(featureName);
}

registerHelper('withFeature', withFeature);
registerHelper('withoutFeature', withoutFeature);
