import Ember from 'ember';

export function stubService(app, name, service) {
  let container = app.container || app.__container__;
  container.registry.register(`service:${name}`, service);
}

Ember.Test.registerHelper('stubService', stubService);
