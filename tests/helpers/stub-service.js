import { registerHelper } from '@ember/test';

export function stubService(app, name, service) {
  let container = app.container || app.__container__;
  container.registry.register(`service:${name}`, service);
}

registerHelper('stubService', stubService);
